/**
 * Subjects Seed Data
 *
 * Defines the normalized academic architecture for school subjects
 * including standard graded subjects, stream-based subjects, optionals, and activities.
 *
 * Each subject follows:
 * {
 *   subjectId,          // Primary normalized identifier (stable)
 *   subjectName,        // Predictable readable academic name
 *   subjectType,        // 'academic' | 'optional' | 'activity'
 *   applicableClasses,  // List of grades this subject is offered in
 *   streamApplicability,// Division streams this is active for
 *   id,                 // Legacy alias (compat)
 *   name,               // Legacy alias (compat)
 *   category,           // Legacy alias (compat)
 *   code,
 *   description
 * }
 */

const ALL_CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const FOUNDATION_CLASSES = ["Nursery", "LKG", "UKG", "1"];
const PRIMARY_CLASSES = ["2", "3", "4"];
const MIDDLE_CLASSES = ["5", "6", "7", "8"];
const SECONDARY_CLASSES = ["9", "10"];
const JUNIOR_CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];
const SENIOR_CLASSES = ["11", "12"];
const ALL_STREAMS = [
  "SCIENCE_NON_MEDICAL",
  "SCIENCE_MEDICAL",
  "COMMERCE",
  "HUMANITIES",
];

export const subjectsSeed = [
  // ============================================
  // FOUNDATION SUBJECTS — NURSERY TO CLASS 1
  // ============================================
  {
    subjectId: "sub-rhymes",
    id: "sub-rhymes",
    subjectName: "Rhymes",
    name: "Rhymes",
    code: "ACT-RHY",
    subjectType: "activity",
    category: "activity",
    applicableClasses: FOUNDATION_CLASSES,
    streamApplicability: [],
    description: "Nursery rhymes, poems, and recitation.",
  },
  {
    subjectId: "sub-storytelling",
    id: "sub-storytelling",
    subjectName: "Storytelling",
    name: "Storytelling",
    code: "ACT-STO",
    subjectType: "activity",
    category: "activity",
    applicableClasses: FOUNDATION_CLASSES,
    streamApplicability: [],
    description: "Story reading, moral stories, and comprehension.",
  },
  {
    subjectId: "sub-drawing",
    id: "sub-drawing",
    subjectName: "Drawing",
    name: "Drawing",
    code: "ART-DRW",
    subjectType: "activity",
    category: "activity",
    applicableClasses: FOUNDATION_CLASSES,
    streamApplicability: [],
    description: "Basic drawing, coloring, and craft activities.",
  },
  {
    subjectId: "sub-evs",
    id: "sub-evs",
    subjectName: "EVS",
    name: "EVS",
    code: "SCI-EVS",
    subjectType: "academic",
    category: "academic",
    applicableClasses: FOUNDATION_CLASSES,
    streamApplicability: [],
    description: "Environmental studies, nature, and surroundings.",
  },

  // ============================================
  // PRIMARY SUBJECTS — CLASS 2 TO 4
  // ============================================
  {
    subjectId: "sub-gk",
    id: "sub-gk",
    subjectName: "General Knowledge",
    name: "General Knowledge",
    code: "SOC-GK",
    subjectType: "academic",
    category: "academic",
    applicableClasses: PRIMARY_CLASSES,
    streamApplicability: [],
    description: "Current affairs, general awareness, and quiz.",
  },
  {
    subjectId: "sub-comp-primary",
    id: "sub-comp-primary",
    subjectName: "Computer",
    name: "Computer",
    code: "TEC-COM",
    subjectType: "academic",
    category: "academic",
    applicableClasses: PRIMARY_CLASSES,
    streamApplicability: [],
    description: "Basic computer operations and digital literacy.",
  },

  // ============================================
  // MIDDLE SCHOOL SUBJECTS — CLASS 5 TO 8
  // ============================================
  {
    subjectId: "sub-sanskrit",
    id: "sub-sanskrit",
    subjectName: "Sanskrit",
    name: "Sanskrit",
    code: "LNG-SAN",
    subjectType: "academic",
    category: "academic",
    applicableClasses: MIDDLE_CLASSES,
    streamApplicability: [],
    description: "Sanskrit grammar, literature, and composition.",
  },

  // ============================================
  // SECONDARY SCHOOL SUBJECTS — CLASS 9 TO 10
  // ============================================
  {
    subjectId: "sub-sans-sec",
    id: "sub-sans-sec",
    subjectName: "Sanskrit",
    name: "Sanskrit",
    code: "LNG-SAS",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SECONDARY_CLASSES,
    streamApplicability: [],
    description: "Advanced Sanskrit grammar and literature.",
  },

  // ============================================
  // CORE SUBJECTS — NURSERY TO CLASS 10
  // ============================================
  {
    subjectId: "sub-eng",
    id: "sub-eng",
    subjectName: "English",
    name: "English",
    code: "LNG-ENG",
    subjectType: "academic",
    category: "academic",
    applicableClasses: ALL_CLASSES,
    streamApplicability: ALL_STREAMS,
    description: "Literature, grammar, and communication skills.",
  },
  {
    subjectId: "sub-hin",
    id: "sub-hin",
    subjectName: "Hindi",
    name: "Hindi",
    code: "LNG-HIN",
    subjectType: "academic",
    category: "academic",
    applicableClasses: JUNIOR_CLASSES,
    streamApplicability: [],
    description: "Hindi literature, grammar, and composition.",
  },
  {
    subjectId: "sub-math",
    id: "sub-math",
    subjectName: "Mathematics",
    name: "Mathematics",
    code: "SCI-MTH",
    subjectType: "academic",
    category: "academic",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Arithmetic, algebra, geometry, and trigonometry.",
  },
  {
    subjectId: "sub-sci",
    id: "sub-sci",
    subjectName: "Science",
    name: "Science",
    code: "SCI-SCI",
    subjectType: "academic",
    category: "academic",
    applicableClasses: JUNIOR_CLASSES,
    streamApplicability: [],
    description: "Physics, chemistry, and biology fundamentals.",
  },
  {
    subjectId: "sub-sst",
    id: "sub-sst",
    subjectName: "Social Studies",
    name: "Social Studies",
    code: "SOC-SST",
    subjectType: "academic",
    category: "academic",
    applicableClasses: JUNIOR_CLASSES,
    streamApplicability: [],
    description: "History, geography, civics, and economics basics.",
  },

  // ============================================
  // STREAM-BASED SUBJECTS — CLASS 11 & 12
  // ============================================
  // Science Stream (Medical & Non-Medical)
  {
    subjectId: "sub-phy",
    id: "sub-phy",
    subjectName: "Physics",
    name: "Physics",
    code: "SCI-PHY11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["SCIENCE_NON_MEDICAL", "SCIENCE_MEDICAL"],
    description: "Mechanics, thermodynamics, optics, and modern physics.",
  },
  {
    subjectId: "sub-chem",
    id: "sub-chem",
    subjectName: "Chemistry",
    name: "Chemistry",
    code: "SCI-CHM11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["SCIENCE_NON_MEDICAL", "SCIENCE_MEDICAL"],
    description: "Atomic structure, organic chemistry, and chemical kinetics.",
  },
  {
    subjectId: "sub-bio",
    id: "sub-bio",
    subjectName: "Biology",
    name: "Biology",
    code: "SCI-BIO11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["SCIENCE_MEDICAL"],
    description: "Cell biology, genetics, human anatomy, and ecology.",
  },

  // Commerce Stream
  {
    subjectId: "sub-acc",
    id: "sub-acc",
    subjectName: "Accountancy",
    name: "Accountancy",
    code: "COM-ACC11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["COMMERCE"],
    description:
      "Financial accounting, partnership accounts, and company accounts.",
  },
  {
    subjectId: "sub-bst",
    id: "sub-bst",
    subjectName: "Business Studies",
    name: "Business Studies",
    code: "COM-BST11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["COMMERCE"],
    description:
      "Principles of management, marketing, and business environment.",
  },
  {
    subjectId: "sub-eco",
    id: "sub-eco",
    subjectName: "Economics",
    name: "Economics",
    code: "COM-ECO11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["COMMERCE", "HUMANITIES"],
    description:
      "Microeconomics, macroeconomics, and Indian economic development.",
  },

  // Humanities Stream
  {
    subjectId: "sub-his",
    id: "sub-his",
    subjectName: "History",
    name: "History",
    code: "HUM-HIS11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["HUMANITIES"],
    description: "Ancient, medieval, and modern Indian and world history.",
  },
  {
    subjectId: "sub-pol",
    id: "sub-pol",
    subjectName: "Political Science",
    name: "Political Science",
    code: "HUM-POL11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["HUMANITIES"],
    description: "Political theory, constitution, and international relations.",
  },
  {
    subjectId: "sub-geo",
    id: "sub-geo",
    subjectName: "Geography",
    name: "Geography",
    code: "HUM-GEO11",
    subjectType: "academic",
    category: "academic",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ["HUMANITIES"],
    description: "Physical geography, human geography, and map work.",
  },

  // ============================================
  // OPTIONAL SUBJECTS — CLASS 11 & 12
  // ============================================
  {
    subjectId: "sub-pe",
    id: "sub-pe",
    subjectName: "Physical Education",
    name: "Physical Education",
    code: "OPT-PE11",
    subjectType: "optional",
    category: "optional",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ALL_STREAMS,
    description: "Sports theory, yoga, and physical fitness.",
  },
  {
    subjectId: "sub-cs",
    id: "sub-cs",
    subjectName: "Computer Science",
    name: "Computer Science",
    code: "OPT-CS11",
    subjectType: "optional",
    category: "optional",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ALL_STREAMS,
    description: "Python programming, data structures, and algorithms.",
  },
  {
    subjectId: "sub-ip",
    id: "sub-ip",
    subjectName: "Information Practices",
    name: "Information Practices",
    code: "OPT-IP11",
    subjectType: "optional",
    category: "optional",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ALL_STREAMS,
    description: "Database management, SQL, and web development.",
  },
  {
    subjectId: "sub-hs",
    id: "sub-hs",
    subjectName: "Home Science",
    name: "Home Science",
    code: "OPT-HS11",
    subjectType: "optional",
    category: "optional",
    applicableClasses: SENIOR_CLASSES,
    streamApplicability: ALL_STREAMS,
    description:
      "Food and nutrition, resource management, and human development.",
  },

  // ============================================
  // ACTIVITY PERIODS — TIMETABLE ONLY (NO GRADING)
  // ============================================
  {
    subjectId: "act-games",
    id: "act-games",
    subjectName: "Games / PT",
    name: "Games / PT",
    code: "ACT-GAMES",
    subjectType: "activity",
    category: "activity",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Physical training, sports, and games.",
  },
  {
    subjectId: "act-library",
    id: "act-library",
    subjectName: "Library",
    name: "Library",
    code: "ACT-LIB",
    subjectType: "activity",
    category: "activity",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Reading, research, and self-study period.",
  },
  {
    subjectId: "act-art",
    id: "act-art",
    subjectName: "Art",
    name: "Art",
    code: "ACT-ART",
    subjectType: "activity",
    category: "activity",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Drawing, painting, and creative arts.",
  },
  {
    subjectId: "act-music",
    id: "act-music",
    subjectName: "Music",
    name: "Music",
    code: "ACT-MUS",
    subjectType: "activity",
    category: "activity",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Vocal and instrumental music training.",
  },
  {
    subjectId: "act-activity",
    id: "act-activity",
    subjectName: "Activity Period",
    name: "Activity Period",
    code: "ACT-ACT",
    subjectType: "activity",
    category: "activity",
    applicableClasses: ALL_CLASSES,
    streamApplicability: [],
    description: "Co-curricular activities and club meetings.",
  },
];
