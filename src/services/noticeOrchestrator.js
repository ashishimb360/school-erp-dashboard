/**
 * Notice Orchestrator Service
 * Centralized service for generating notices from workflow events
 * Maps workflow events to notice templates and handles audience resolution
 */

import { emitEvent, onEvent, WORKFLOW_EVENTS } from "./workflowEvents";
import {
  generateNoticeFromTemplate,
  NOTICE_TEMPLATES,
} from "./noticeTemplates";
import {
  resolveAudience,
  resolveExamAudience,
  resolveEvaluationAudience,
  resolveAttendanceAudience,
  resolveFeeAudience,
  resolvePTMAudience,
  resolveAssignmentAudience,
  resolveTransportAudience,
  resolveResultAudience,
  expandAudience,
} from "./audienceResolver";
import { createNotice } from "./noticeService";
import { NOTICE_STATUS } from "../mockDB/seed/notices";

/**
 * Event-to-Template mapping
 * Defines which template to use for each workflow event
 */
const EVENT_TO_TEMPLATE_MAP = {
  // Examination Events
  [WORKFLOW_EVENTS.EXAM_CREATED]: "tentative_exam",
  [WORKFLOW_EVENTS.EXAM_SCHEDULED]: "official_datesheet",
  [WORKFLOW_EVENTS.EXAM_CANCELLED]: "exam_rescheduled",
  [WORKFLOW_EVENTS.EXAM_RESCHEDULED]: "exam_rescheduled",
  [WORKFLOW_EVENTS.EXAM_DATESHEET_PUBLISHED]: "official_datesheet",
  [WORKFLOW_EVENTS.EXAM_CYCLE_CREATED]: "tentative_exam",
  [WORKFLOW_EVENTS.EVALUATION_STARTED]: "evaluation_started",
  [WORKFLOW_EVENTS.EVALUATION_COMPLETED]: "result_declared",

  // Result Events
  [WORKFLOW_EVENTS.RESULT_PUBLISHED]: "result_declared",
  [WORKFLOW_EVENTS.RESULT_DECLARED]: "result_declared",
  [WORKFLOW_EVENTS.RESULT_PENDING]: "result_pending",

  // Attendance Events
  [WORKFLOW_EVENTS.ATTENDANCE_LOW]: "attendance_warning",
  [WORKFLOW_EVENTS.ATTENDANCE_CRITICAL]: "attendance_critical",
  [WORKFLOW_EVENTS.ATTENDANCE_ABSENT]: "attendance_absent",

  // Fee Events
  [WORKFLOW_EVENTS.FEE_DUE]: "fee_due",
  [WORKFLOW_EVENTS.FEE_OVERDUE]: "fee_overdue",
  [WORKFLOW_EVENTS.FEE_REMINDER]: "fee_due",

  // PTM Events
  [WORKFLOW_EVENTS.PTM_SCHEDULED]: "ptm_scheduled",
  [WORKFLOW_EVENTS.PTM_CANCELLED]: "ptm_rescheduled",
  [WORKFLOW_EVENTS.PTM_RESCHEDULED]: "ptm_rescheduled",

  // Assignment Events
  [WORKFLOW_EVENTS.ASSIGNMENT_CREATED]: "assignment_created",
  [WORKFLOW_EVENTS.ASSIGNMENT_DUE]: "assignment_due_reminder",

  // Timetable Events
  [WORKFLOW_EVENTS.TIMETABLE_UPDATED]: "timetable_updated",
  [WORKFLOW_EVENTS.TIMETABLE_PUBLISHED]: "timetable_updated",

  // Transport Events
  [WORKFLOW_EVENTS.ROUTE_CHANGED]: "route_changed",
  [WORKFLOW_EVENTS.STOP_CHANGED]: "route_changed",
  [WORKFLOW_EVENTS.BUS_DELAYED]: "route_changed",

  // Administrative Events
  [WORKFLOW_EVENTS.HOLIDAY_DECLARED]: "holiday_declared",
  [WORKFLOW_EVENTS.EVENT_ANNOUNCED]: "event_announced",
  [WORKFLOW_EVENTS.EMERGENCY_ALERT]: "emergency_alert",
  [WORKFLOW_EVENTS.GENERAL_NOTICE]: "general_notice",

  // Discipline Events
  [WORKFLOW_EVENTS.DISCIPLINE_ISSUE]: "discipline_warning",
  [WORKFLOW_EVENTS.DISCIPLINE_WARNING]: "discipline_warning",
  [WORKFLOW_EVENTS.DISCIPLINE_ACTION]: "discipline_warning",
};

/**
 * Audience resolver mapping
 * Maps events to their specific audience resolution functions
 */
const EVENT_TO_AUDIENCE_RESOLVER = {
  [WORKFLOW_EVENTS.EXAM_CREATED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EXAM_SCHEDULED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EXAM_CANCELLED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EXAM_RESCHEDULED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EXAM_DATESHEET_PUBLISHED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EXAM_CYCLE_CREATED]: resolveExamAudience,
  [WORKFLOW_EVENTS.EVALUATION_STARTED]: resolveEvaluationAudience,
  [WORKFLOW_EVENTS.EVALUATION_COMPLETED]: resolveExamAudience,

  [WORKFLOW_EVENTS.RESULT_PUBLISHED]: resolveResultAudience,
  [WORKFLOW_EVENTS.RESULT_DECLARED]: resolveResultAudience,
  [WORKFLOW_EVENTS.RESULT_PENDING]: resolveResultAudience,

  [WORKFLOW_EVENTS.ATTENDANCE_LOW]: resolveAttendanceAudience,
  [WORKFLOW_EVENTS.ATTENDANCE_CRITICAL]: resolveAttendanceAudience,
  [WORKFLOW_EVENTS.ATTENDANCE_ABSENT]: resolveAttendanceAudience,

  [WORKFLOW_EVENTS.FEE_DUE]: resolveFeeAudience,
  [WORKFLOW_EVENTS.FEE_OVERDUE]: resolveFeeAudience,
  [WORKFLOW_EVENTS.FEE_REMINDER]: resolveFeeAudience,

  [WORKFLOW_EVENTS.PTM_SCHEDULED]: resolvePTMAudience,
  [WORKFLOW_EVENTS.PTM_CANCELLED]: resolvePTMAudience,
  [WORKFLOW_EVENTS.PTM_RESCHEDULED]: resolvePTMAudience,

  [WORKFLOW_EVENTS.ASSIGNMENT_CREATED]: resolveAssignmentAudience,
  [WORKFLOW_EVENTS.ASSIGNMENT_DUE]: resolveAssignmentAudience,

  [WORKFLOW_EVENTS.ROUTE_CHANGED]: resolveTransportAudience,
  [WORKFLOW_EVENTS.STOP_CHANGED]: resolveTransportAudience,
  [WORKFLOW_EVENTS.BUS_DELAYED]: resolveTransportAudience,
};

/**
 * Generate a notice from a workflow event
 * @param {string} eventType - The workflow event type
 * @param {Object} eventData - The event data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The created notice
 */
export async function generateNoticeFromEvent(
  eventType,
  eventData,
  options = {},
) {
  const templateKey = EVENT_TO_TEMPLATE_MAP[eventType];
  if (!templateKey) {
    console.warn(`No template mapped for event: ${eventType}`);
    return null;
  }

  // Generate notice from template
  const notice = generateNoticeFromTemplate(
    templateKey,
    eventData,
    options.overrides,
  );

  // Resolve audience
  const audienceResolver = EVENT_TO_AUDIENCE_RESOLVER[eventType];
  let targetAudience;

  if (audienceResolver) {
    targetAudience = await audienceResolver(eventData);
  } else if (options.targetAudience) {
    targetAudience = options.targetAudience;
  } else {
    targetAudience = await resolveAudience(eventData);
  }

  // Expand audience if needed
  if (options.expandAudience) {
    targetAudience = await expandAudience(
      targetAudience,
      options.expandOptions,
    );
  }

  notice.targetAudience = targetAudience;

  // Set additional properties
  notice.sourceModule =
    options.sourceModule || eventData.sourceModule || "system";
  notice.createdBy = options.createdBy || eventData.createdBy || "system";
  notice.createdAt = options.createdAt || new Date().toISOString();
  notice.publishedAt = options.publishedAt || notice.createdAt;
  notice.expiresAt = options.expiresAt || eventData.expiresAt;

  return notice;
}

/**
 * Create and publish a notice from a workflow event
 * @param {string} eventType - The workflow event type
 * @param {Object} eventData - The event data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The created notice
 */
export async function createNoticeFromEvent(
  eventType,
  eventData,
  options = {},
) {
  const notice = await generateNoticeFromEvent(eventType, eventData, options);
  if (!notice) {
    return null;
  }

  // Create the notice in the system
  const createdNotice = await createNotice(notice);

  // Emit a notice created event for tracking
  emitEvent("NOTICE_CREATED", {
    noticeId: createdNotice.id,
    eventType,
    targetAudience: createdNotice.targetAudience,
  });

  return createdNotice;
}

/**
 * Setup event listeners for automatic notice generation
 * Call this during app initialization to enable automatic notice generation
 */
export function setupNoticeOrchestrator() {
  // Listen to workflow events and generate notices automatically
  const eventTypes = Object.keys(WORKFLOW_EVENTS);

  eventTypes.forEach((eventType) => {
    onEvent(eventType, async (eventData) => {
      try {
        if (eventType === WORKFLOW_EVENTS.RESULT_PUBLISHED) {
          const dateStr = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const targetClassIds = eventData.classIds || [];
          const examId = eventData.examId;

          // 1. Student/Parent notice
          await createNotice({
            title: "Examination Results Published",
            titleEn: "Examination Results Published",
            content: "Your examination results are now available.\n\nPlease review:\n- marks\n- grades\n- remarks\n- report card\nthrough the portal.",
            contentEn: "Your examination results are now available.\n\nPlease review:\n- marks\n- grades\n- remarks\n- report card\nthrough the portal.",
            date: dateStr,
            isPinned: true,
            status: "Published",
            category: "examination",
            priority: "urgent",
            icon: "Award",
            allowedRoles: ["student", "parent"],
            sourceModule: "examinations",
            sourceEntityId: examId,
            sourceEntityType: "exam_cycle",
            targetAudience: {
              type: "CLASS",
              classIds: targetClassIds,
              includeStudents: true,
              includeParents: true
            },
            metadata: {
              operationalState: "published",
              sourceEntityId: examId,
              sourceEntityType: "exam_cycle"
            }
          });

          // 2. Class Teacher notice
          await createNotice({
            title: "Class Results Released",
            titleEn: "Class Results Released",
            content: "Results for your assigned class\nhave been officially published.\n\nPlease prepare for:\n- PTMs\n- student counseling\n- academic review discussions.",
            contentEn: "Results for your assigned class\nhave been officially published.\n\nPlease prepare for:\n- PTMs\n- student counseling\n- academic review discussions.",
            date: dateStr,
            isPinned: true,
            status: "Published",
            category: "examination",
            priority: "important",
            icon: "Users",
            allowedRoles: ["teacher"],
            sourceModule: "examinations",
            sourceEntityId: examId,
            sourceEntityType: "exam_cycle",
            targetAudience: {
              type: "CLASS",
              classIds: targetClassIds,
              includeClassTeachers: true
            },
            metadata: {
              operationalState: "published",
              teacherNoticeRole: "class_teacher",
              sourceEntityId: examId
            }
          });

          // 3. Subject Teacher notice
          await createNotice({
            title: "Evaluation Cycle Closed",
            titleEn: "Evaluation Cycle Closed",
            content: "Result publication completed successfully.\n\nThank you for completing\nthe evaluation workflow.",
            contentEn: "Result publication completed successfully.\n\nThank you for completing\nthe evaluation workflow.",
            date: dateStr,
            isPinned: true,
            status: "Published",
            category: "examination",
            priority: "important",
            icon: "BookOpen",
            allowedRoles: ["teacher"],
            sourceModule: "examinations",
            sourceEntityId: examId,
            sourceEntityType: "exam_cycle",
            targetAudience: {
              type: "CLASS",
              classIds: targetClassIds,
              includeSubjectTeachers: true
            },
            metadata: {
              operationalState: "published",
              teacherNoticeRole: "subject_teacher",
              sourceEntityId: examId
            }
          });
          return;
        }

        // Check if auto-generation is enabled for this event
        if (eventData.autoGenerate !== false) {
          await createNoticeFromEvent(eventType, eventData);
        }
      } catch (error) {
        console.error(
          `Failed to generate notice for event ${eventType}:`,
          error,
        );
      }
    });
  });

  console.log("Notice Orchestrator initialized with automatic event listeners");
}

/**
 * Manually trigger notice generation for an event
 * Use this when you want to generate a notice without emitting the event
 * @param {string} eventType - The workflow event type
 * @param {Object} eventData - The event data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The created notice
 */
export async function triggerNoticeGeneration(
  eventType,
  eventData,
  options = {},
) {
  return createNoticeFromEvent(eventType, eventData, options);
}

/**
 * Batch generate notices from multiple events
 * @param {Array} events - Array of { eventType, eventData, options }
 * @returns {Promise<Array>} Array of created notices
 */
export async function batchGenerateNotices(events) {
  const results = await Promise.allSettled(
    events.map(({ eventType, eventData, options }) =>
      createNoticeFromEvent(eventType, eventData, options),
    ),
  );

  return results.map((result, index) => ({
    success: result.status === "fulfilled",
    notice: result.status === "fulfilled" ? result.value : null,
    error: result.status === "rejected" ? result.reason : null,
    event: events[index],
  }));
}

/**
 * Get the template key for an event type
 * @param {string} eventType - The workflow event type
 * @returns {string|null} The template key or null if not found
 */
export function getTemplateForEvent(eventType) {
  return EVENT_TO_TEMPLATE_MAP[eventType] || null;
}

/**
 * Check if an event type has a mapped template
 * @param {string} eventType - The workflow event type
 * @returns {boolean} True if mapped, false otherwise
 */
export function isEventMapped(eventType) {
  return EVENT_TO_TEMPLATE_MAP.hasOwnProperty(eventType);
}

/**
 * Get all mapped event types
 * @returns {Array} Array of mapped event types
 */
export function getMappedEventTypes() {
  return Object.keys(EVENT_TO_TEMPLATE_MAP);
}

/**
 * Register a custom event-to-template mapping
 * @param {string} eventType - The workflow event type
 * @param {string} templateKey - The template key
 * @param {Function} audienceResolver - Optional custom audience resolver
 */
export function registerEventMapping(eventType, templateKey, audienceResolver) {
  EVENT_TO_TEMPLATE_MAP[eventType] = templateKey;
  if (audienceResolver) {
    EVENT_TO_AUDIENCE_RESOLVER[eventType] = audienceResolver;
  }
}

/**
 * Remove an event-to-template mapping
 * @param {string} eventType - The workflow event type
 */
export function unregisterEventMapping(eventType) {
  delete EVENT_TO_TEMPLATE_MAP[eventType];
  delete EVENT_TO_AUDIENCE_RESOLVER[eventType];
}

// Export the orchestrator as a singleton object
export const noticeOrchestrator = {
  generateNoticeFromEvent,
  createNoticeFromEvent,
  setupNoticeOrchestrator,
  triggerNoticeGeneration,
  batchGenerateNotices,
  getTemplateForEvent,
  isEventMapped,
  getMappedEventTypes,
  registerEventMapping,
  unregisterEventMapping,
};
