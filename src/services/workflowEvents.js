/**
 * Workflow Event System
 * Centralized event types for notice orchestration
 */

export const WORKFLOW_EVENTS = {
  // Examination Events
  EXAM_CREATED: "EXAM_CREATED",
  EXAM_SCHEDULED: "EXAM_SCHEDULED",
  EXAM_CANCELLED: "EXAM_CANCELLED",
  EXAM_RESCHEDULED: "EXAM_RESCHEDULED",
  EXAM_DATESHEET_PUBLISHED: "EXAM_DATESHEET_PUBLISHED",
  EXAM_CYCLE_CREATED: "EXAM_CYCLE_CREATED",
  EVALUATION_STARTED: "EVALUATION_STARTED",
  EVALUATION_COMPLETED: "EVALUATION_COMPLETED",

  // Result Events
  RESULT_PUBLISHED: "RESULT_PUBLISHED",
  RESULT_DECLARED: "RESULT_DECLARED",
  RESULT_PENDING: "RESULT_PENDING",

  // Attendance Events
  ATTENDANCE_LOW: "ATTENDANCE_LOW",
  ATTENDANCE_CRITICAL: "ATTENDANCE_CRITICAL",
  ATTENDANCE_ABSENT: "ATTENDANCE_ABSENT",
  ATTENDANCE_MARKED: "ATTENDANCE_MARKED",

  // Fee Events
  FEE_DUE: "FEE_DUE",
  FEE_OVERDUE: "FEE_OVERDUE",
  FEE_PAID: "FEE_PAID",
  FEE_REMINDER: "FEE_REMINDER",

  // PTM Events
  PTM_SCHEDULED: "PTM_SCHEDULED",
  PTM_CANCELLED: "PTM_CANCELLED",
  PTM_RESCHEDULED: "PTM_RESCHEDULED",

  // Assignment Events
  ASSIGNMENT_CREATED: "ASSIGNMENT_CREATED",
  ASSIGNMENT_DUE: "ASSIGNMENT_DUE",
  ASSIGNMENT_SUBMITTED: "ASSIGNMENT_SUBMITTED",

  // Timetable Events
  TIMETABLE_UPDATED: "TIMETABLE_UPDATED",
  TIMETABLE_PUBLISHED: "TIMETABLE_PUBLISHED",
  CLASS_CHANGED: "CLASS_CHANGED",

  // Transport Events
  ROUTE_CHANGED: "ROUTE_CHANGED",
  STOP_CHANGED: "STOP_CHANGED",
  BUS_DELAYED: "BUS_DELAYED",

  // Administrative Events
  HOLIDAY_DECLARED: "HOLIDAY_DECLARED",
  EVENT_ANNOUNCED: "EVENT_ANNOUNCED",
  EMERGENCY_ALERT: "EMERGENCY_ALERT",
  GENERAL_NOTICE: "GENERAL_NOTICE",

  // Discipline Events
  DISCIPLINE_ISSUE: "DISCIPLINE_ISSUE",
  DISCIPLINE_WARNING: "DISCIPLINE_WARNING",
  DISCIPLINE_ACTION: "DISCIPLINE_ACTION",
};

/**
 * Simple event emitter for workflow events
 * In production, this could be replaced with a more robust event bus
 */
class WorkflowEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to a workflow event
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - The callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit a workflow event
   * @param {string} eventType - The event type to emit
   * @param {Object} payload - The event payload
   */
  emit(eventType, payload = {}) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event type
   * @param {string} eventType - The event type
   */
  removeAllListeners(eventType) {
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
  }
}

// Global event emitter instance
export const workflowEventEmitter = new WorkflowEventEmitter();

/**
 * Convenience function to emit workflow events
 * @param {string} eventType - The event type
 * @param {Object} payload - The event payload
 */
export function emitEvent(eventType, payload = {}) {
  workflowEventEmitter.emit(eventType, payload);
}

/**
 * Convenience function to subscribe to workflow events
 * @param {string} eventType - The event type
 * @param {Function} callback - The callback function
 * @returns {Function} Unsubscribe function
 */
export function onEvent(eventType, callback) {
  return workflowEventEmitter.on(eventType, callback);
}
