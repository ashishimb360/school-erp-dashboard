/**
 * Support Center Contracts
 * Defines the canonical shapes, statuses, and categories for support requests.
 */

/**
 * @typedef {Object} RemarkDTO
 * @property {string} id - Unique identifier for the remark
 * @property {string} message - Content of the remark (append only)
 * @property {string} createdBy - Identifier of the creator (e.g. Employee ID)
 * @property {string} createdAt - ISO string timestamp of creation
 */

/**
 * @typedef {Object} SupportRequestDTO
 * @property {string} id - Unique identifier
 * @property {string} requesterType - "Student" | "Parent" | "Teacher" | "Employee"
 * @property {string} requesterId - ID of the requester
 * @property {string} requesterName - Display name of the requester
 * @property {string} category - Type of support request
 * @property {string} title - Brief summary
 * @property {string} description - Detailed context
 * @property {boolean} anonymous - If true, requester is obscured
 * @property {string} [complaintAgainstType] - Entity type the complaint is against
 * @property {string} [complaintAgainstId] - Target ID for complaints
 * @property {string} priority - Urgency
 * @property {string} status - Current state
 * @property {RemarkDTO[]} remarks - Append-only timeline notes
 * @property {string} createdAt - ISO string timestamp
 * @property {string} updatedAt - ISO string timestamp
 */

export const SUPPORT_STATUSES = [
  "Open",
  "In Review",
  "Resolved",
  "Closed"
];

export const SUPPORT_CATEGORIES = [
  "Help Request",
  "Complaint",
  "Feedback",
  "Suggestion",
  "Technical Support"
];
