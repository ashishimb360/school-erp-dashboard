/**
 * subjectArchitecture.js
 *
 * Institutional Academic Subject Architecture for EduDash ERP.
 * Normalizes subject handling across all academic levels.
 *
 * Architecture Principles:
 * - Fixed subjects for Nursery-Class 10 (automatically derived from class level)
 * - Stream-based subjects for Class 11-12 (automatically derived from stream selection)
 * - Activity Periods are timetable-only (no grading, no exams, no assignments)
 * - Optional subjects are single-selection for Class 11 (continue to Class 12)
 * - One teacher specializes in ONE subject only
 */

// ============================================================================
// SUBJECT TYPE CATEGORIES
// ============================================================================

export const SUBJECT_TYPES = {
  ACADEMIC: 'academic',    // Graded subjects with exams, assignments, marks
  ACTIVITY: 'activity',    // Timetable-only (no grading, no exams)
  OPTIONAL: 'optional',    // Student-selected additional subject
};

// ============================================================================
// FIXED SUBJECTS — NURSERY TO CLASS 10
// ============================================================================

export const FIXED_SUBJECTS_NURSERY_10 = [
  { id: 'sub-eng', name: 'English', code: 'LNG-ENG', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-hin', name: 'Hindi', code: 'LNG-HIN', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-math', name: 'Mathematics', code: 'SCI-MTH', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-sci', name: 'Science', code: 'SCI-SCI', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-sst', name: 'Social Studies', code: 'SOC-SST', category: SUBJECT_TYPES.ACADEMIC },
];

// ============================================================================
// ACTIVITY PERIODS — TIMETABLE ONLY (NO GRADING)
// ============================================================================

export const ACTIVITY_PERIODS = [
  { id: 'act-games', name: 'Games / PT', code: 'ACT-GAMES', category: SUBJECT_TYPES.ACTIVITY },
  { id: 'act-library', name: 'Library', code: 'ACT-LIB', category: SUBJECT_TYPES.ACTIVITY },
  { id: 'act-art', name: 'Art', code: 'ACT-ART', category: SUBJECT_TYPES.ACTIVITY },
  { id: 'act-music', name: 'Music', code: 'ACT-MUS', category: SUBJECT_TYPES.ACTIVITY },
  { id: 'act-activity', name: 'Activity Period', code: 'ACT-ACT', category: SUBJECT_TYPES.ACTIVITY },
];

// ============================================================================
// STREAM-BASED SUBJECTS — CLASS 11 & 12
// ============================================================================

// Science Medical Stream
export const SCIENCE_MEDICAL_SUBJECTS = [
  { id: 'sub-phy', name: 'Physics', code: 'SCI-PHY', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-chem', name: 'Chemistry', code: 'SCI-CHM', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-bio', name: 'Biology', code: 'SCI-BIO', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-eng', name: 'English', code: 'LNG-ENG', category: SUBJECT_TYPES.ACADEMIC },
];

// Science Non-Medical Stream
export const SCIENCE_NON_MEDICAL_SUBJECTS = [
  { id: 'sub-phy', name: 'Physics', code: 'SCI-PHY', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-chem', name: 'Chemistry', code: 'SCI-CHM', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-math', name: 'Mathematics', code: 'SCI-MTH', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-eng', name: 'English', code: 'LNG-ENG', category: SUBJECT_TYPES.ACADEMIC },
];

// Commerce Stream
export const COMMERCE_SUBJECTS = [
  { id: 'sub-acc', name: 'Accountancy', code: 'COM-ACC', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-bst', name: 'Business Studies', code: 'COM-BST', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-eco', name: 'Economics', code: 'COM-ECO', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-eng', name: 'English', code: 'LNG-ENG', category: SUBJECT_TYPES.ACADEMIC },
];

// Humanities Stream
export const HUMANITIES_SUBJECTS = [
  { id: 'sub-his', name: 'History', code: 'HUM-HIS', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-pol', name: 'Political Science', code: 'HUM-POL', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-geo', name: 'Geography', code: 'HUM-GEO', category: SUBJECT_TYPES.ACADEMIC },
  { id: 'sub-eng', name: 'English', code: 'LNG-ENG', category: SUBJECT_TYPES.ACADEMIC },
];

// ============================================================================
// OPTIONAL SUBJECTS — CLASS 11 (CONTINUE TO CLASS 12)
// ============================================================================

export const OPTIONAL_SUBJECTS = [
  { id: 'sub-pe', name: 'Physical Education', code: 'OPT-PE', category: SUBJECT_TYPES.OPTIONAL },
  { id: 'sub-cs', name: 'Computer Science', code: 'OPT-CS', category: SUBJECT_TYPES.OPTIONAL },
  { id: 'sub-ip', name: 'Information Practices', code: 'OPT-IP', category: SUBJECT_TYPES.OPTIONAL },
  { id: 'sub-hs', name: 'Home Science', code: 'OPT-HS', category: SUBJECT_TYPES.OPTIONAL },
];

// ============================================================================
// STREAM DEFINITIONS
// ============================================================================

export const STREAMS = {
  SCIENCE_MEDICAL: {
    id: 'SCIENCE_MEDICAL',
    name: 'Science (Medical)',
    classLevels: ['11', '12'],
    coreSubjects: SCIENCE_MEDICAL_SUBJECTS,
    optionalSlot: 1, // Number of optional subjects allowed
  },
  SCIENCE_NON_MEDICAL: {
    id: 'SCIENCE_NON_MEDICAL',
    name: 'Science (Non-Medical)',
    classLevels: ['11', '12'],
    coreSubjects: SCIENCE_NON_MEDICAL_SUBJECTS,
    optionalSlot: 1,
  },
  COMMERCE: {
    id: 'COMMERCE',
    name: 'Commerce',
    classLevels: ['11', '12'],
    coreSubjects: COMMERCE_SUBJECTS,
    optionalSlot: 1,
  },
  HUMANITIES: {
    id: 'HUMANITIES',
    name: 'Humanities',
    classLevels: ['11', '12'],
    coreSubjects: HUMANITIES_SUBJECTS,
    optionalSlot: 1,
  },
};

// ============================================================================
// CLASS LEVEL CONFIGURATION
// ============================================================================

export const CLASS_LEVEL_CONFIG = {
  // Nursery to Class 10: Fixed subjects automatically assigned
  NURSERY: { level: 'Nursery', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  LKG: { level: 'LKG', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  UKG: { level: 'UKG', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '1': { level: '1', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '2': { level: '2', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '3': { level: '3', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '4': { level: '4', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '5': { level: '5', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '6': { level: '6', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '7': { level: '7', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '8': { level: '8', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '9': { level: '9', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },
  '10': { level: '10', type: 'fixed', subjects: FIXED_SUBJECTS_NURSERY_10 },

  // Class 11-12: Stream-based subjects
  '11': { level: '11', type: 'stream', availableStreams: Object.values(STREAMS) },
  '12': { level: '12', type: 'stream', availableStreams: Object.values(STREAMS) },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get subjects for a specific class level
 * @param {string} classLevel - Class level (e.g., '1', '11', 'Nursery')
 * @returns {Array} Array of subject objects
 */
export const getSubjectsForClassLevel = (classLevel) => {
  const config = CLASS_LEVEL_CONFIG[classLevel];
  if (!config) return [];

  if (config.type === 'fixed') {
    return config.subjects;
  }

  return []; // Stream-based requires stream selection
};

/**
 * Get core subjects for a specific stream
 * @param {string} streamId - Stream identifier
 * @returns {Array} Array of core subject objects
 */
export const getCoreSubjectsForStream = (streamId) => {
  const stream = STREAMS[streamId];
  return stream ? stream.coreSubjects : [];
};

/**
 * Get complete subject list for a student (core + optional)
 * @param {string} classLevel - Student's class level
 * @param {string} streamId - Student's stream (for 11-12)
 * @param {string} optionalSubjectId - Selected optional subject (for 11-12)
 * @returns {Array} Complete subject list
 */
export const getStudentSubjects = (classLevel, streamId = null, optionalSubjectId = null) => {
  // Nursery to Class 10: Fixed subjects
  if (['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(classLevel)) {
    return getSubjectsForClassLevel(classLevel);
  }

  // Class 11-12: Stream-based + optional
  if (['11', '12'].includes(classLevel) && streamId) {
    const coreSubjects = getCoreSubjectsForStream(streamId);
    const subjects = [...coreSubjects];

    // Add optional subject if selected
    if (optionalSubjectId) {
      const optional = OPTIONAL_SUBJECTS.find(s => s.id === optionalSubjectId);
      if (optional) {
        subjects.push(optional);
      }
    }

    return subjects;
  }

  return [];
};

/**
 * Check if a subject is an academic subject (graded)
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const isAcademicSubject = (subjectId) => {
  const allAcademic = [
    ...FIXED_SUBJECTS_NURSERY_10,
    ...SCIENCE_MEDICAL_SUBJECTS,
    ...SCIENCE_NON_MEDICAL_SUBJECTS,
    ...COMMERCE_SUBJECTS,
    ...HUMANITIES_SUBJECTS,
    ...OPTIONAL_SUBJECTS,
  ];
  return allAcademic.some(s => s.id === subjectId);
};

/**
 * Check if a subject is an activity period
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const isActivityPeriod = (subjectId) => {
  return ACTIVITY_PERIODS.some(s => s.id === subjectId);
};

/**
 * Check if a subject is optional
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const isOptionalSubject = (subjectId) => {
  return OPTIONAL_SUBJECTS.some(s => s.id === subjectId);
};

/**
 * Get subject by ID
 * @param {string} subjectId - Subject identifier
 * @returns {Object|null} Subject object or null
 */
export const getSubjectById = (subjectId) => {
  const allSubjects = [
    ...FIXED_SUBJECTS_NURSERY_10,
    ...SCIENCE_MEDICAL_SUBJECTS,
    ...SCIENCE_NON_MEDICAL_SUBJECTS,
    ...COMMERCE_SUBJECTS,
    ...HUMANITIES_SUBJECTS,
    ...OPTIONAL_SUBJECTS,
    ...ACTIVITY_PERIODS,
  ];
  return allSubjects.find(s => s.id === subjectId) || null;
};

/**
 * Get all activity periods
 * @returns {Array} Activity period subjects
 */
export const getActivityPeriods = () => {
  return [...ACTIVITY_PERIODS];
};

/**
 * Get available optional subjects
 * @returns {Array} Optional subject list
 */
export const getOptionalSubjects = () => {
  return [...OPTIONAL_SUBJECTS];
};

/**
 * Validate if a stream ID is valid
 * @param {string} streamId - Stream identifier
 * @returns {boolean}
 */
export const isValidStream = (streamId) => {
  return Object.prototype.hasOwnProperty.call(STREAMS, streamId);
};

/**
 * Get stream configuration
 * @param {string} streamId - Stream identifier
 * @returns {Object|null} Stream configuration or null
 */
export const getStreamConfig = (streamId) => {
  return STREAMS[streamId] || null;
};

/**
 * Get all available streams for Class 11-12
 * @returns {Array} Stream configurations
 */
export const getAvailableStreams = () => {
  return Object.values(STREAMS);
};

// ============================================================================
// TEACHER SUBJECT SPECIALIZATION
// ============================================================================

/**
 * Validate teacher-subject specialization
 * One teacher should specialize in ONE subject only
 * @param {string} teacherId - Teacher identifier
 * @param {string} subjectId - Subject identifier
 * @param {Array} existingAssignments - Existing teacher assignments
 * @returns {boolean} True if valid specialization
 */
export const isValidTeacherSpecialization = (teacherId, subjectId, existingAssignments) => {
  const teacherAssignments = existingAssignments.filter(a => a.teacherId === teacherId);

  // No existing assignments = valid
  if (teacherAssignments.length === 0) return true;

  // Check if all existing assignments are for the same subject
  return teacherAssignments.every(a => a.subjectId === subjectId);
};

/**
 * Get subject specialization for a teacher
 * @param {string} teacherId - Teacher identifier
 * @param {Array} assignments - Teacher subject assignments
 * @returns {string|null} Subject ID or null
 */
export const getTeacherSpecialization = (teacherId, assignments) => {
  const teacherAssignments = assignments.filter(a => a.teacherId === teacherId);
  if (teacherAssignments.length === 0) return null;

  // Return the first subject (all should be same per specialization rule)
  return teacherAssignments[0].subjectId;
};

// ============================================================================
// CLASSROOM MODEL
// ============================================================================

/**
 * Classroom configuration for fixed room allocation
 * Indian school model: Students stay in fixed classroom, teachers move
 */
export const CLASSROOM_CONFIG = {
  // Room allocation by class-section
  'class-11a': { room: 'Room 301', capacity: 40 },
  'class-11b': { room: 'Room 302', capacity: 40 },
  'class-11c': { room: 'Room 303', capacity: 40 },
  'class-11d': { room: 'Room 304', capacity: 40 },

  // Lab rooms for specific subjects
  'lab-physics': { room: 'Physics Lab 1', capacity: 30 },
  'lab-chemistry': { room: 'Chemistry Lab 2', capacity: 30 },
  'lab-biology': { room: 'Biology Lab 3', capacity: 30 },
  'lab-computer-a': { room: 'Computer Lab A', capacity: 25 },
  'lab-computer-b': { room: 'Computer Lab B', capacity: 25 },
};

/**
 * Get classroom for a class-section
 * @param {string} classId - Class identifier
 * @returns {Object|null} Classroom configuration
 */
export const getClassroom = (classId) => {
  return CLASSROOM_CONFIG[classId] || null;
};

/**
 * Get room for a subject period
 * Teachers move to different rooms based on subject requirements
 * @param {string} classId - Class identifier (fixed classroom)
 * @param {string} subjectId - Subject identifier
 * @returns {string} Room allocation
 */
export const getSubjectRoom = (classId, subjectId) => {
  const classRoom = CLASSROOM_CONFIG[classId]?.room;

  // Lab subjects use specialized rooms
  const labRooms = {
    'sub-phy': CLASSROOM_CONFIG['lab-physics']?.room,
    'sub-chem': CLASSROOM_CONFIG['lab-chemistry']?.room,
    'sub-bio': CLASSROOM_CONFIG['lab-biology']?.room,
    'sub-cs': CLASSROOM_CONFIG['lab-computer-a']?.room,
    'sub-ip': CLASSROOM_CONFIG['lab-computer-b']?.room,
  };

  return labRooms[subjectId] || classRoom || 'Room TBD';
};
