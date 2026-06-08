/**
 * Streams Seed Data
 *
 * Defines the core stream offerings for Class 11 and 12, including
 * their required subject track associations and optional choices.
 *
 * Each stream follows:
 * {
 *   streamId,            // Normalized identifier (stable)
 *   streamName,          // Readable stream name
 *   compulsorySubjects,  // Core academic subject track
 *   optionalSubjects,    // Elective choices for Indian K-12
 *   applicableClasses,   // ["11", "12"]
 *   id,                  // Legacy alias (compat)
 *   name,                // Legacy alias (compat)
 *   subjectIds           // Legacy alias (compat)
 * }
 */

const SENIOR_OPTIONALS = ["sub-pe", "sub-cs", "sub-ip", "sub-hs"];
const SENIOR_CLASSES = ["11", "12"];

export const streamsSeed = [
  {
    streamId: "SCIENCE_NON_MEDICAL",
    id: "SCIENCE_NON_MEDICAL",
    streamName: "Science (Non-Medical)",
    name: "Science (Non-Medical)",
    compulsorySubjects: ["sub-eng", "sub-phy", "sub-chem", "sub-math"],
    subjectIds: ["sub-eng", "sub-phy", "sub-chem", "sub-math"],
    optionalSubjects: SENIOR_OPTIONALS,
    applicableClasses: SENIOR_CLASSES,
  },
  {
    streamId: "SCIENCE_MEDICAL",
    id: "SCIENCE_MEDICAL",
    streamName: "Science (Medical)",
    name: "Science (Medical)",
    compulsorySubjects: ["sub-eng", "sub-phy", "sub-chem", "sub-bio"],
    subjectIds: ["sub-eng", "sub-phy", "sub-chem", "sub-bio"],
    optionalSubjects: SENIOR_OPTIONALS,
    applicableClasses: SENIOR_CLASSES,
  },
  {
    streamId: "COMMERCE",
    id: "COMMERCE",
    streamName: "Commerce",
    name: "Commerce",
    compulsorySubjects: ["sub-eng", "sub-acc", "sub-bst", "sub-eco"],
    subjectIds: ["sub-eng", "sub-acc", "sub-bst", "sub-eco"],
    optionalSubjects: SENIOR_OPTIONALS,
    applicableClasses: SENIOR_CLASSES,
  },
  {
    streamId: "HUMANITIES",
    id: "HUMANITIES",
    streamName: "Humanities",
    name: "Humanities",
    compulsorySubjects: ["sub-eng", "sub-his", "sub-pol", "sub-geo"],
    subjectIds: ["sub-eng", "sub-his", "sub-pol", "sub-geo"],
    optionalSubjects: SENIOR_OPTIONALS,
    applicableClasses: SENIOR_CLASSES,
  },
];
