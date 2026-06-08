/**
 * @typedef {Object} AssignmentDTO
 * @property {string} id
 * @property {string} title
 * @property {string} subjectId
 * @property {string} classId
 * @property {string} dueDate
 * @property {string} status
 */

/**
 * @typedef {Object} QuestionPaperDTO
 * @property {string} id
 * @property {string} title
 * @property {string} classId
 * @property {string} section
 * @property {string} subjectId
 * @property {string} teacherId
 * @property {string} status
 * @property {string} content
 * @property {string|null} uploadedFile
 * @property {string} remarks
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ExamResultDTO
 * @property {string} examId
 * @property {string} studentId
 * @property {number} aggregatePercentage
 * @property {Object[]} subjectMarks
 */
