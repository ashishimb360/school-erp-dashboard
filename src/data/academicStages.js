/**
 * data/academicStages.js
 *
 * Canonical Academic Stage definitions for CBSE Indian K-12 schools.
 *
 * Two dimensions govern teacher assignment:
 *   1. SUBJECT SPECIALIZATION — what the teacher can teach (specializationSubjectId)
 *   2. STAGE ELIGIBILITY      — which class levels the teacher is authorized for (eligibleStages)
 *
 * Architecture: both dimensions must match for a valid assignment.
 */

// ─── Stage Constants ──────────────────────────────────────────────────────────

export const ACADEMIC_STAGES = {
  FOUNDATION:        "foundation",        // Nursery, LKG, UKG
  PRIMARY:           "primary",           // Class 1–5
  MIDDLE:            "middle",            // Class 6–8
  SECONDARY:         "secondary",         // Class 9–10
  SENIOR_SECONDARY:  "senior_secondary",  // Class 11–12
};

// Ordered array for display/range logic
export const STAGE_ORDER = [
  ACADEMIC_STAGES.FOUNDATION,
  ACADEMIC_STAGES.PRIMARY,
  ACADEMIC_STAGES.MIDDLE,
  ACADEMIC_STAGES.SECONDARY,
  ACADEMIC_STAGES.SENIOR_SECONDARY,
];

export const STAGE_LABELS = {
  [ACADEMIC_STAGES.FOUNDATION]:       "Foundation (Nursery–UKG)",
  [ACADEMIC_STAGES.PRIMARY]:          "Primary (Class 1–5)",
  [ACADEMIC_STAGES.MIDDLE]:           "Middle School (Class 6–8)",
  [ACADEMIC_STAGES.SECONDARY]:        "Secondary (Class 9–10)",
  [ACADEMIC_STAGES.SENIOR_SECONDARY]: "Senior Secondary (Class 11–12)",
};

// ─── Stage Derivation ─────────────────────────────────────────────────────────

/**
 * Returns the academic stage for a given class level string.
 * @param {string} level - e.g. "Nursery", "LKG", "1", "6", "11"
 * @returns {string} ACADEMIC_STAGES value
 */
export const getStageFromLevel = (level) => {
  if (["Nursery", "LKG", "UKG"].includes(level)) return ACADEMIC_STAGES.FOUNDATION;
  const n = parseInt(level, 10);
  if (n >= 1 && n <= 5)  return ACADEMIC_STAGES.PRIMARY;
  if (n >= 6 && n <= 8)  return ACADEMIC_STAGES.MIDDLE;
  if (n >= 9 && n <= 10) return ACADEMIC_STAGES.SECONDARY;
  if (n >= 11 && n <= 12) return ACADEMIC_STAGES.SENIOR_SECONDARY;
  return ACADEMIC_STAGES.PRIMARY; // fallback
};

/**
 * Returns the academic stage for a classId like "class-8a", "class-nurseryb", "class-11a".
 * @param {string} classId
 * @returns {string} ACADEMIC_STAGES value
 */
export const getStageFromClassId = (classId) => {
  if (!classId) return ACADEMIC_STAGES.PRIMARY;
  const raw = classId.replace("class-", "").replace(/[a-d]$/, "");
  if (raw === "nursery") return ACADEMIC_STAGES.FOUNDATION;
  if (raw === "lkg")     return ACADEMIC_STAGES.FOUNDATION;
  if (raw === "ukg")     return ACADEMIC_STAGES.FOUNDATION;
  return getStageFromLevel(raw);
};

// ─── Teacher Type Constants ───────────────────────────────────────────────────

/**
 * Formal teacher type taxonomy.
 * Maps to designation and stage eligibility defaults.
 */
export const TEACHER_TYPES_V2 = {
  FOUNDATION_GENERALIST: "FOUNDATION_GENERALIST", // Nursery–UKG, all subjects
  PRIMARY_GENERALIST:    "PRIMARY_GENERALIST",     // Class 1–5, multi-subject
  SUBJECT_SPECIALIST:    "SUBJECT_SPECIALIST",     // Middle/Secondary, single-subject
  SENIOR_SPECIALIST:     "SENIOR_SPECIALIST",      // Secondary/Sr. Secondary, single-subject
  ACTIVITY_TEACHER:      "ACTIVITY_TEACHER",       // Cross-stage, activity subjects
  LAB_TEACHER:           "LAB_TEACHER",            // Lab-only assignments
};

/**
 * Default eligibleStages by teacher type.
 * These are defaults — individual teacher records can override.
 */
export const DEFAULT_STAGES_BY_TEACHER_TYPE = {
  [TEACHER_TYPES_V2.FOUNDATION_GENERALIST]: [ACADEMIC_STAGES.FOUNDATION],
  [TEACHER_TYPES_V2.PRIMARY_GENERALIST]:    [ACADEMIC_STAGES.PRIMARY],
  [TEACHER_TYPES_V2.SUBJECT_SPECIALIST]:    [ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY],
  [TEACHER_TYPES_V2.SENIOR_SPECIALIST]:     [ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
  [TEACHER_TYPES_V2.ACTIVITY_TEACHER]:      [ACADEMIC_STAGES.FOUNDATION, ACADEMIC_STAGES.PRIMARY, ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
  [TEACHER_TYPES_V2.LAB_TEACHER]:           [ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
};

/**
 * Maps legacy teacherType strings (from expandedTeachers) to the new taxonomy.
 */
export const LEGACY_TYPE_MAP = {
  FOUNDATION:  TEACHER_TYPES_V2.FOUNDATION_GENERALIST,
  SPECIALIZED: TEACHER_TYPES_V2.SUBJECT_SPECIALIST,
  ACTIVITY:    TEACHER_TYPES_V2.ACTIVITY_TEACHER,
};

/**
 * Maps designation string → eligible stages (used for the static cbseTeachers array).
 */
export const STAGE_BY_DESIGNATION = {
  "Primary Teacher":             [ACADEMIC_STAGES.FOUNDATION, ACADEMIC_STAGES.PRIMARY],
  "Junior Teacher":              [ACADEMIC_STAGES.PRIMARY, ACADEMIC_STAGES.MIDDLE],
  "Trained Graduate Teacher (TGT)": [ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY],
  "Post Graduate Teacher (PGT)": [ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
  "Senior PGT":                  [ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
  "Activity Teacher":            [ACADEMIC_STAGES.FOUNDATION, ACADEMIC_STAGES.PRIMARY, ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY, ACADEMIC_STAGES.SENIOR_SECONDARY],
};

/**
 * Derives eligibleStages for a teacher record.
 * Checks: teacher.eligibleStages → designation fallback → teacherType default.
 *
 * @param {Object} teacher
 * @returns {string[]}
 */
export const deriveEligibleStages = (teacher) => {
  // Explicit declaration wins
  if (Array.isArray(teacher.eligibleStages) && teacher.eligibleStages.length > 0) {
    return teacher.eligibleStages;
  }
  const designation = teacher.metadata?.designation || teacher.designation;
  if (designation && STAGE_BY_DESIGNATION[designation]) {
    return STAGE_BY_DESIGNATION[designation];
  }
  const legacyType = teacher.teacherType || teacher.metadata?.teacherType;
  if (legacyType && LEGACY_TYPE_MAP[legacyType]) {
    return DEFAULT_STAGES_BY_TEACHER_TYPE[LEGACY_TYPE_MAP[legacyType]];
  }
  return [ACADEMIC_STAGES.MIDDLE, ACADEMIC_STAGES.SECONDARY];
};
