/**
 * Notice Action Service
 * Handles acknowledgement, RSVP, and form submission workflows for notices
 */

import { getNotices, updateNotice } from "./noticeService";
import { ACTION_TYPES } from "../mockDB/seed/notices";

/**
 * Response types for notice actions
 */
export const RESPONSE_TYPES = {
  ACKNOWLEDGED: "acknowledged",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  SUBMITTED: "submitted",
};

/**
 * Action status for user's response to a notice
 */
export const ACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
};

/**
 * Get user's action response for a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @returns {object|null} The user's response or null if not responded
 */
export async function getUserActionResponse(noticeId, userId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice || !notice.actionResponses) return null;

  return notice.actionResponses.find((r) => r.userId === userId) || null;
}

/**
 * Check if user has responded to a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @returns {boolean} True if user has responded
 */
export async function hasUserResponded(noticeId, userId) {
  const response = await getUserActionResponse(noticeId, userId);
  return response !== null;
}

/**
 * Get action status for a user and notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @returns {string} The action status (pending, completed, overdue)
 */
export async function getActionStatus(noticeId, userId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) return ACTION_STATUS.PENDING;

  // Check if user has already responded
  const hasResponded = await hasUserResponded(noticeId, userId);
  if (hasResponded) return ACTION_STATUS.COMPLETED;

  // Check if notice requires action
  if (!notice.requiresAction) return ACTION_STATUS.COMPLETED;

  // Check if action deadline has passed
  if (notice.actionDeadline) {
    const deadline = new Date(notice.actionDeadline);
    const now = new Date();
    if (now > deadline) return ACTION_STATUS.OVERDUE;
  }

  return ACTION_STATUS.PENDING;
}

/**
 * Acknowledge a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @returns {object} The updated notice
 */
export async function acknowledgeNotice(noticeId, userId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  if (!notice.requiresAction) {
    throw new Error("This notice does not require action");
  }

  if (notice.actionType !== ACTION_TYPES.ACKNOWLEDGE) {
    throw new Error("This notice does not require acknowledgement");
  }

  // Check if already acknowledged
  const existingResponse = await getUserActionResponse(noticeId, userId);
  if (existingResponse) {
    throw new Error("Already acknowledged");
  }

  const actionResponses = notice.actionResponses || [];
  actionResponses.push({
    userId,
    responseType: RESPONSE_TYPES.ACKNOWLEDGED,
    responseAt: new Date().toISOString(),
  });

  await updateNotice(noticeId, { actionResponses });
  console.log(`[NoticeAction] User ${userId} acknowledged notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

/**
 * RSVP to a notice (accept/decline)
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @param {string} response - "accepted" or "declined"
 * @param {object} [responseData] - Additional response data (comments, etc.)
 * @returns {object} The updated notice
 */
export async function rsvpNotice(noticeId, userId, response, responseData = {}) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  if (!notice.requiresAction) {
    throw new Error("This notice does not require action");
  }

  if (notice.actionType !== ACTION_TYPES.RSVP) {
    throw new Error("This notice does not require RSVP");
  }

  if (response !== RESPONSE_TYPES.ACCEPTED && response !== RESPONSE_TYPES.DECLINED) {
    throw new Error("Invalid RSVP response");
  }

  // Check if already responded
  const existingResponse = await getUserActionResponse(noticeId, userId);
  if (existingResponse) {
    throw new Error("Already responded");
  }

  const actionResponses = notice.actionResponses || [];
  actionResponses.push({
    userId,
    responseType: response,
    responseAt: new Date().toISOString(),
    responseData,
  });

  await updateNotice(noticeId, { actionResponses });
  console.log(`[NoticeAction] User ${userId} RSVP ${response} to notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

/**
 * Submit a form response for a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @param {object} formData - The form data to submit
 * @returns {object} The updated notice
 */
export async function submitNoticeForm(noticeId, userId, formData) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  if (!notice.requiresAction) {
    throw new Error("This notice does not require action");
  }

  if (notice.actionType !== ACTION_TYPES.FORM_SUBMISSION) {
    throw new Error("This notice does not require form submission");
  }

  // Check if already submitted
  const existingResponse = await getUserActionResponse(noticeId, userId);
  if (existingResponse) {
    throw new Error("Already submitted");
  }

  const actionResponses = notice.actionResponses || [];
  actionResponses.push({
    userId,
    responseType: RESPONSE_TYPES.SUBMITTED,
    responseAt: new Date().toISOString(),
    responseData: formData,
  });

  await updateNotice(noticeId, { actionResponses });
  console.log(`[NoticeAction] User ${userId} submitted form for notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

/**
 * Submit a payment for a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @param {object} paymentData - Payment details
 * @returns {object} The updated notice
 */
export async function submitNoticePayment(noticeId, userId, paymentData) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  if (!notice.requiresAction) {
    throw new Error("This notice does not require action");
  }

  if (notice.actionType !== ACTION_TYPES.PAYMENT) {
    throw new Error("This notice does not require payment");
  }

  // Check if already paid
  const existingResponse = await getUserActionResponse(noticeId, userId);
  if (existingResponse) {
    throw new Error("Already paid");
  }

  const actionResponses = notice.actionResponses || [];
  actionResponses.push({
    userId,
    responseType: RESPONSE_TYPES.SUBMITTED,
    responseAt: new Date().toISOString(),
    responseData: paymentData,
  });

  await updateNotice(noticeId, { actionResponses });
  console.log(`[NoticeAction] User ${userId} submitted payment for notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

/**
 * Upload a document for a notice
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @param {object} documentData - Document details
 * @returns {object} The updated notice
 */
export async function uploadNoticeDocument(noticeId, userId, documentData) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  if (!notice.requiresAction) {
    throw new Error("This notice does not require action");
  }

  if (notice.actionType !== ACTION_TYPES.DOCUMENT_UPLOAD) {
    throw new Error("This notice does not require document upload");
  }

  // Check if already uploaded
  const existingResponse = await getUserActionResponse(noticeId, userId);
  if (existingResponse) {
    throw new Error("Already uploaded");
  }

  const actionResponses = notice.actionResponses || [];
  actionResponses.push({
    userId,
    responseType: RESPONSE_TYPES.SUBMITTED,
    responseAt: new Date().toISOString(),
    responseData: documentData,
  });

  await updateNotice(noticeId, { actionResponses });
  console.log(`[NoticeAction] User ${userId} uploaded document for notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

/**
 * Get action statistics for a notice
 * @param {string} noticeId - The notice ID
 * @returns {object} Statistics including total responses, acceptance rate, etc.
 */
export async function getNoticeActionStats(noticeId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) return null;

  const actionResponses = notice.actionResponses || [];
  const totalResponses = actionResponses.length;

  if (totalResponses === 0) {
    return {
      totalResponses: 0,
      acknowledged: 0,
      accepted: 0,
      declined: 0,
      submitted: 0,
      acceptanceRate: 0,
    };
  }

  const acknowledged = actionResponses.filter(
    (r) => r.responseType === RESPONSE_TYPES.ACKNOWLEDGED,
  ).length;
  const accepted = actionResponses.filter(
    (r) => r.responseType === RESPONSE_TYPES.ACCEPTED,
  ).length;
  const declined = actionResponses.filter(
    (r) => r.responseType === RESPONSE_TYPES.DECLINED,
  ).length;
  const submitted = actionResponses.filter(
    (r) => r.responseType === RESPONSE_TYPES.SUBMITTED,
  ).length;

  const acceptanceRate =
    accepted + declined > 0 ? (accepted / (accepted + declined)) * 100 : 0;

  return {
    totalResponses,
    acknowledged,
    accepted,
    declined,
    submitted,
    acceptanceRate: Math.round(acceptanceRate),
  };
}

/**
 * Get all pending actions for a user
 * @param {string} userId - The user ID
 * @returns {array} List of notices requiring action from the user
 */
export async function getPendingActionsForUser(userId) {
  const notices = await getNotices();
  const pendingActions = [];

  for (const notice of notices) {
    if (!notice.requiresAction) continue;
    if (notice.status !== "published") continue;

    const hasResponded = await hasUserResponded(notice.id, userId);
    if (hasResponded) continue;

    // Check if deadline has passed
    const isOverdue = notice.actionDeadline
      ? new Date(notice.actionDeadline) < new Date()
      : false;

    pendingActions.push({
      ...notice,
      actionStatus: isOverdue ? ACTION_STATUS.OVERDUE : ACTION_STATUS.PENDING,
    });
  }

  return pendingActions;
}

/**
 * Get all overdue actions for a user
 * @param {string} userId - The user ID
 * @returns {array} List of overdue notices requiring action
 */
export async function getOverdueActionsForUser(userId) {
  const pendingActions = await getPendingActionsForUser(userId);
  return pendingActions.filter((a) => a.actionStatus === ACTION_STATUS.OVERDUE);
}

/**
 * Get all responses for a specific notice
 * @param {string} noticeId - The notice ID
 * @returns {array} List of all action responses
 */
export async function getNoticeResponses(noticeId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) return [];

  return notice.actionResponses || [];
}

/**
 * Get responses by type for a notice
 * @param {string} noticeId - The notice ID
 * @param {string} responseType - The response type to filter by
 * @returns {array} List of responses of the specified type
 */
export async function getResponsesByType(noticeId, responseType) {
  const responses = await getNoticeResponses(noticeId);
  return responses.filter((r) => r.responseType === responseType);
}

/**
 * Delete a user's action response (admin only)
 * @param {string} noticeId - The notice ID
 * @param {string} userId - The user ID
 * @returns {object} The updated notice
 */
export async function deleteActionResponse(noticeId, userId) {
  const notices = await getNotices();
  const notice = notices.find((n) => n.id === noticeId);
  if (!notice) throw new Error("Notice not found");

  const actionResponses = notice.actionResponses || [];
  const filteredResponses = actionResponses.filter((r) => r.userId !== userId);

  await updateNotice(noticeId, { actionResponses: filteredResponses });
  console.log(`[NoticeAction] Deleted response from user ${userId} for notice ${noticeId}`);

  return await getNotices().then((n) => n.find((n) => n.id === noticeId));
}

// Export as a singleton object
export const noticeActionService = {
  getUserActionResponse,
  hasUserResponded,
  getActionStatus,
  acknowledgeNotice,
  rsvpNotice,
  submitNoticeForm,
  submitNoticePayment,
  uploadNoticeDocument,
  getNoticeActionStats,
  getPendingActionsForUser,
  getOverdueActionsForUser,
  getNoticeResponses,
  getResponsesByType,
  deleteActionResponse,
};
