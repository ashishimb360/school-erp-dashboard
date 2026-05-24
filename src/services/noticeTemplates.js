/**
 * Notice Templates
 * Pre-defined templates for common workflow-generated notices
 */

import {
  NOTICE_CATEGORIES,
  NOTICE_PRIORITIES,
  NOTICE_STATUS,
  AUDIENCE_TYPES,
  DELIVERY_CHANNELS,
  ACTION_TYPES,
} from "../mockDB/seed/notices";

/**
 * Template registry
 * Each template defines how to generate a notice from event data
 */
export const NOTICE_TEMPLATES = {
  // Examination Templates
  tentative_exam: {
    category: NOTICE_CATEGORIES.EXAMINATION,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.EMAIL],
    generateTitle: (data) => `Tentative Exam Schedule - ${data.examName}`,
    generateMessage: (data) =>
      `Tentative examination schedule for ${data.examName} has been released. ${data.subject || "All subjects"} are scheduled for ${data.date || "upcoming dates"}. This is a tentative schedule and may be subject to change.`,
    generateMetadata: (data) => ({
      examName: data.examName,
      examType: "tentative",
      subject: data.subject,
      date: data.date,
    }),
  },

  official_datesheet: {
    category: NOTICE_CATEGORIES.EXAMINATION,
    priority: NOTICE_PRIORITIES.URGENT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Official Exam Datesheet - ${data.examName}`,
    generateMessage: (data) =>
      `Official examination datesheet for ${data.examName} has been published. Exams will be held from ${data.startDate} to ${data.endDate}. Please check the detailed schedule in the examinations module. Bring your admit card and stationery.`,
    generateMetadata: (data) => ({
      examName: data.examName,
      examType: "official",
      startDate: data.startDate,
      endDate: data.endDate,
    }),
  },

  exam_rescheduled: {
    category: NOTICE_CATEGORIES.EXAMINATION,
    priority: NOTICE_PRIORITIES.URGENT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Exam Rescheduled - ${data.subject}`,
    generateMessage: (data) =>
      `The ${data.subject} examination has been rescheduled from ${data.oldDate} to ${data.newDate}. Venue: ${data.venue}. Please update your schedule accordingly.`,
    generateMetadata: (data) => ({
      subject: data.subject,
      oldDate: data.oldDate,
      newDate: data.newDate,
      venue: data.venue,
    }),
  },

  evaluation_started: {
    category: NOTICE_CATEGORIES.OPERATIONAL,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.FORM_SUBMISSION,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.EMAIL],
    generateTitle: (data) => `Evaluation Started - ${data.examName}`,
    generateMessage: (data) =>
      `Evaluation for ${data.examName} has started. Please begin marking answer sheets for ${data.subject}. Marks submission deadline: ${data.deadline}. Ensure timely completion to avoid delays in result declaration.`,
    generateMetadata: (data) => ({
      examName: data.examName,
      subject: data.subject,
      classId: data.classId,
      deadline: data.deadline,
      totalStudents: data.totalStudents,
    }),
  },

  // Result Templates
  result_declared: {
    category: NOTICE_CATEGORIES.RESULTS,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Results Published - ${data.examName}`,
    generateMessage: (data) =>
      `Results for ${data.examName} have been published. Please check the student portal for detailed marks. Parent-teacher meetings to discuss performance will be scheduled next week.`,
    generateMetadata: (data) => ({
      examName: data.examName,
      publishedDate: data.publishedDate,
    }),
  },

  result_pending: {
    category: NOTICE_CATEGORIES.RESULTS,
    priority: NOTICE_PRIORITIES.INFO,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL],
    generateTitle: (data) => `Result Processing - ${data.examName}`,
    generateMessage: (data) =>
      `Results for ${data.examName} are currently being processed and will be published by ${data.expectedDate}. Please check the portal for updates.`,
    generateMetadata: (data) => ({
      examName: data.examName,
      expectedDate: data.expectedDate,
    }),
  },

  // Attendance Templates
  attendance_warning: {
    category: NOTICE_CATEGORIES.ATTENDANCE,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.SMS],
    generateTitle: (data) => `Low Attendance Warning - ${data.className}`,
    generateMessage: (data) =>
      `Your attendance for the current academic session is ${data.percentage}%. This is below the required ${data.requiredPercentage}% and may affect your eligibility for examinations. Please ensure regular attendance from now onwards.`,
    generateMetadata: (data) => ({
      attendancePercentage: data.percentage,
      requiredPercentage: data.requiredPercentage,
      classId: data.classId,
    }),
  },

  attendance_critical: {
    category: NOTICE_CATEGORIES.ATTENDANCE,
    priority: NOTICE_PRIORITIES.CRITICAL,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Critical Attendance Alert - ${data.className}`,
    generateMessage: (data) =>
      `Your attendance is critically low at ${data.percentage}%. Immediate action is required to avoid being debarred from examinations. Please contact the class teacher or principal immediately.`,
    generateMetadata: (data) => ({
      attendancePercentage: data.percentage,
      requiredPercentage: data.requiredPercentage,
      classId: data.classId,
    }),
  },

  attendance_absent: {
    category: NOTICE_CATEGORIES.ATTENDANCE,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.SMS],
    generateTitle: (data) => `Absence Recorded - ${data.date}`,
    generateMessage: (data) =>
      `Your child was absent from school on ${data.date} without prior intimation. Please ensure you submit a leave application or provide a valid reason for the absence.`,
    generateMetadata: (data) => ({
      absenceDate: data.date,
      studentId: data.studentId,
      classId: data.classId,
    }),
  },

  // Fee Templates
  fee_due: {
    category: NOTICE_CATEGORIES.FEES,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.PAYMENT,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Fee Payment Due - ${data.quarter}`,
    generateMessage: (data) =>
      `${data.quarter} fee payment for the academic session ${data.session} is due by ${data.dueDate}. Outstanding amount: ₹${data.amount}. Please ensure timely payment to avoid late fee charges.`,
    generateMetadata: (data) => ({
      quarter: data.quarter,
      dueDate: data.dueDate,
      outstandingAmount: data.amount,
      session: data.session,
    }),
  },

  fee_overdue: {
    category: NOTICE_CATEGORIES.FEES,
    priority: NOTICE_PRIORITIES.URGENT,
    requiresAction: true,
    actionType: ACTION_TYPES.PAYMENT,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Fee Payment Overdue - ${data.quarter}`,
    generateMessage: (data) =>
      `${data.quarter} fee payment is overdue by ${data.daysOverdue} days. Outstanding amount: ₹${data.amount} including late fee charges of ₹${data.lateFee}. Please clear the dues immediately to avoid further penalties.`,
    generateMetadata: (data) => ({
      quarter: data.quarter,
      daysOverdue: data.daysOverdue,
      outstandingAmount: data.amount,
      lateFee: data.lateFee,
    }),
  },

  // PTM Templates
  ptm_scheduled: {
    category: NOTICE_CATEGORIES.PTM,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Parent-Teacher Meeting Scheduled`,
    generateMessage: (data) =>
      `Parent-Teacher Meeting is scheduled on ${data.date} from ${data.startTime} to ${data.endTime}. Please attend to discuss your child's academic progress. Individual appointment slots will be allocated on first-come-first-served basis.`,
    generateMetadata: (data) => ({
      ptmDate: data.date,
      ptmStartTime: data.startTime,
      ptmEndTime: data.endTime,
      targetClasses: data.classes,
    }),
  },

  ptm_rescheduled: {
    category: NOTICE_CATEGORIES.PTM,
    priority: NOTICE_PRIORITIES.URGENT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `PTM Rescheduled`,
    generateMessage: (data) =>
      `The Parent-Teacher Meeting has been rescheduled from ${data.oldDate} to ${data.newDate}. Time: ${data.startTime} to ${data.endTime}. Please update your calendar accordingly.`,
    generateMetadata: (data) => ({
      oldDate: data.oldDate,
      newDate: data.newDate,
      startTime: data.startTime,
      endTime: data.endTime,
    }),
  },

  // Assignment Templates
  assignment_created: {
    category: NOTICE_CATEGORIES.ACADEMIC,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.FORM_SUBMISSION,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL],
    generateTitle: (data) => `New Assignment - ${data.subject}`,
    generateMessage: (data) =>
      `${data.title} has been assigned for ${data.subject}. Due date: ${data.dueDate}. Please submit your completed work before the deadline. Late submissions will attract a penalty.`,
    generateMetadata: (data) => ({
      subject: data.subject,
      title: data.title,
      dueDate: data.dueDate,
      classId: data.classId,
    }),
  },

  assignment_due_reminder: {
    category: NOTICE_CATEGORIES.ACADEMIC,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.FORM_SUBMISSION,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL],
    generateTitle: (data) => `Assignment Due Tomorrow - ${data.subject}`,
    generateMessage: (data) =>
      `Reminder: ${data.title} for ${data.subject} is due tomorrow (${data.dueDate}). Please ensure you submit your work on time.`,
    generateMetadata: (data) => ({
      subject: data.subject,
      title: data.title,
      dueDate: data.dueDate,
    }),
  },

  // Timetable Templates
  timetable_updated: {
    category: NOTICE_CATEGORIES.TIMETABLE,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.EMAIL],
    generateTitle: (data) => `Timetable Updated`,
    generateMessage: (data) =>
      `Timetable has been updated effective from ${data.effectiveDate}. Please check your updated schedule in the timetable module. ${data.changes || ""}`,
    generateMetadata: (data) => ({
      effectiveDate: data.effectiveDate,
      changes: data.changes,
      targetClasses: data.classes,
    }),
  },

  // Transport Templates
  route_changed: {
    category: NOTICE_CATEGORIES.TRANSPORT,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.SMS],
    generateTitle: (data) => `Bus Route Change - ${data.routeNumber}`,
    generateMessage: (data) =>
      `Effective from ${data.effectiveDate}, Bus Route ${data.routeNumber} will have a modified schedule. ${data.changes || ""}. Please ensure your child reaches the stop on time.`,
    generateMetadata: (data) => ({
      routeNumber: data.routeNumber,
      effectiveDate: data.effectiveDate,
      changes: data.changes,
    }),
  },

  // Administrative Templates
  holiday_declared: {
    category: NOTICE_CATEGORIES.HOLIDAY,
    priority: NOTICE_PRIORITIES.INFO,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.EMAIL],
    generateTitle: (data) => `Holiday Declared - ${data.holidayName}`,
    generateMessage: (data) =>
      `${data.holidayName} will be observed on ${data.date}. School will remain closed. Classes will resume on ${data.resumeDate}.`,
    generateMetadata: (data) => ({
      holidayName: data.holidayName,
      date: data.date,
      resumeDate: data.resumeDate,
    }),
  },

  event_announced: {
    category: NOTICE_CATEGORIES.EVENT,
    priority: NOTICE_PRIORITIES.INFO,
    requiresAction: false,
    actionType: ACTION_TYPES.NONE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.EMAIL],
    generateTitle: (data) => `Event Announcement - ${data.eventName}`,
    generateMessage: (data) =>
      `${data.eventName} will be held on ${data.date} at ${data.venue}. ${data.description || ""}`,
    generateMetadata: (data) => ({
      eventName: data.eventName,
      date: data.date,
      venue: data.venue,
      description: data.description,
    }),
  },

  emergency_alert: {
    category: NOTICE_CATEGORIES.EMERGENCY,
    priority: NOTICE_PRIORITIES.CRITICAL,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [
      DELIVERY_CHANNELS.PORTAL,
      DELIVERY_CHANNELS.EMAIL,
      DELIVERY_CHANNELS.SMS,
    ],
    generateTitle: (data) => `Emergency Alert`,
    generateMessage: (data) =>
      `${data.message}. Please follow the instructions provided. Contact ${data.contact || "the school office"} for assistance.`,
    generateMetadata: (data) => ({
      emergencyType: data.type,
      message: data.message,
      contact: data.contact,
    }),
  },

  // Discipline Templates
  discipline_warning: {
    category: NOTICE_CATEGORIES.DISCIPLINE,
    priority: NOTICE_PRIORITIES.IMPORTANT,
    requiresAction: true,
    actionType: ACTION_TYPES.ACKNOWLEDGE,
    deliveryChannels: [DELIVERY_CHANNELS.PORTAL, DELIVERY_CHANNELS.SMS],
    generateTitle: (data) => `Disciplinary Warning`,
    generateMessage: (data) =>
      `A disciplinary issue has been recorded regarding ${data.incident}. Please ensure this is not repeated. Further action may be taken if the behavior continues.`,
    generateMetadata: (data) => ({
      incident: data.incident,
      studentId: data.studentId,
      classId: data.classId,
    }),
  },
};

/**
 * Generate a notice from a template
 * @param {string} templateKey - The template key
 * @param {Object} data - The event data
 * @param {Object} overrides - Optional overrides for template properties
 * @returns {Object} The generated notice object
 */
export function generateNoticeFromTemplate(templateKey, data, overrides = {}) {
  const template = NOTICE_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  return {
    category: overrides.category || template.category,
    priority: overrides.priority || template.priority,
    requiresAction:
      overrides.requiresAction !== undefined
        ? overrides.requiresAction
        : template.requiresAction,
    actionType: overrides.actionType || template.actionType,
    deliveryChannels: overrides.deliveryChannels || template.deliveryChannels,
    title: overrides.title || template.generateTitle(data),
    message: overrides.message || template.generateMessage(data),
    metadata: { ...template.generateMetadata(data), ...overrides.metadata },
    sourceModule: overrides.sourceModule || "system",
    status: overrides.status || NOTICE_STATUS.PUBLISHED,
    targetAudience: overrides.targetAudience || { type: AUDIENCE_TYPES.ALL },
    readReceipts: [],
    ...overrides,
  };
}
