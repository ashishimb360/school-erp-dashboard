import {
  getSubjectsForClassLevel,
  getCoreSubjectsForStream,
  getStudentSubjects as getNormalizedStudentSubjects,
  isAcademicSubject,
  isActivityPeriod,
  isOptionalSubject,
  getSubjectById,
  getActivityPeriods,
  getOptionalSubjects,
  getAvailableStreams,
  getStreamConfig,
  isValidStream,
  SUBJECT_TYPES,
} from "../data/subjectArchitecture";
import { getDataProvider } from "../data";

/**
 * academicsService.js
 * Centralized service for academic data resolution.
 * All modules (Attendance, Assignments, Marks) must use these functions.
 *
 * NORMALIZED ACADEMIC ARCHITECTURE:
 * - Fixed subjects for Nursery-Class 10 (automatically derived)
 * - Stream-based subjects for Class 11-12 (automatically derived)
 * - Activity periods are timetable-only (no grading)
 * - Optional subjects are single-selection for Class 11-12
 */

/**
 * Resolves the academic subjects for a specific student.
 * NORMALIZED: Supports both fixed subjects (Nursery-10) and stream-based (11-12).
 * This is the SINGLE SOURCE OF TRUTH for a student's subjects.
 */
export const getSubjectsForStudent = async (studentId) => {
  const provider = getDataProvider();
  const students = await provider.getStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) return [];

  const classLevel = student.classLevel;

  // Nursery to Class 10: Fixed subjects automatically derived from class level
  if (
    [
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
    ].includes(classLevel)
  ) {
    return getSubjectsForClassLevel(classLevel);
  }

  // Class 11-12: Stream-based subjects
  if (["11", "12"].includes(classLevel)) {
    const streamId = student.streamId;
    const optionalSubjectId = student.optionalSubjectId || null;

    if (!streamId) return [];

    return getNormalizedStudentSubjects(
      classLevel,
      streamId,
      optionalSubjectId,
    );
  }

  return [];
};

/**
 * Fetches all courses for the current student (Alias for getSubjectsForStudent)
 */
export const getCourses = async (studentId = "stud-001") => {
  return getSubjectsForStudent(studentId);
};

/**
 * Fetches the timetable for a specific student, filtered by their academic subjects.
 */
export const getTimetable = async (studentId = "stud-001") => {
  const provider = getDataProvider();
  const students = await provider.getStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return { today: [], weekly: {} };
  }

  const allClasses = await provider.getClasses();
  const studentClass = allClasses.find((c) => c.id === student.classId);
  if (!studentClass) {
    return { today: [], weekly: {} };
  }

  // 8 period slots per day with one Lunch Break placed after Period 4
  const slots = [
    {
      time: "08:00 AM",
      startTime: "08:00 AM",
      endTime: "08:50 AM",
      isBreak: false,
      periodName: "Period 1",
      periodCode: "P1",
    },
    {
      time: "08:50 AM",
      startTime: "08:50 AM",
      endTime: "09:40 AM",
      isBreak: false,
      periodName: "Period 2",
      periodCode: "P2",
    },
    {
      time: "09:40 AM",
      startTime: "09:40 AM",
      endTime: "10:30 AM",
      isBreak: false,
      periodName: "Period 3",
      periodCode: "P3",
    },
    {
      time: "10:30 AM",
      startTime: "10:30 AM",
      endTime: "11:20 AM",
      isBreak: false,
      periodName: "Period 4",
      periodCode: "P4",
    },
    {
      time: "11:20 AM",
      startTime: "11:20 AM",
      endTime: "11:50 AM",
      isBreak: true,
      label: "Lunch Break",
      periodCode: "LUNCH",
    },
    {
      time: "11:50 AM",
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      isBreak: false,
      periodName: "Period 5",
      periodCode: "P5",
    },
    {
      time: "12:40 PM",
      startTime: "12:40 PM",
      endTime: "01:30 PM",
      isBreak: false,
      periodName: "Period 6",
      periodCode: "P6",
    },
    {
      time: "01:30 PM",
      startTime: "01:30 PM",
      endTime: "02:20 PM",
      isBreak: false,
      periodName: "Period 7",
      periodCode: "P7",
    },
    {
      time: "02:20 PM",
      startTime: "02:20 PM",
      endTime: "03:10 PM",
      isBreak: false,
      periodName: "Period 8",
      periodCode: "P8",
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekly = {};

  // Get all assignments for this student's class
  const allAssignments = await provider.getTeacherSubjectAssignmentsByClass(
    student.classId,
  );
  const classAssignments = allAssignments.filter(
    (a) => a.classId === student.classId,
  );

  const subjects = await provider.getSubjects();
  const teachers = await provider.getTeachers();

  const subjectsMap = new Map(subjects.map((s) => [s.id, s]));
  const teachersMap = new Map(teachers.map((t) => [t.id, t]));

  // Resolve subjects, teachers and schedules
  const parsedAssignments = [];
  for (const assignment of classAssignments) {
    const sub = subjectsMap.get(assignment.subjectId);
    const teacher = teachersMap.get(assignment.teacherId);
    if (!sub) continue;

    // 1. Direct normalized matching
    if (assignment.day && assignment.period) {
      parsedAssignments.push({
        day: assignment.day,
        periodCode: assignment.period,
        subjectName: sub.name,
        subjectId: sub.id,
        code: sub.code,
        room:
          assignment.room ||
          assignment.roomNumber ||
          sub.room ||
          studentClass.room ||
          "Room 101",
        teacherName: teacher ? teacher.name : "Faculty",
      });
      continue;
    }

    // 2. Legacy schedule parsing fallback
    const scheduleStr = assignment.schedule || sub?.schedule;
    if (!scheduleStr) continue;

    const scheduleParts = scheduleStr.split(" ");
    if (scheduleParts.length < 2) continue;

    const timeStr = scheduleParts[scheduleParts.length - 1]; // e.g. "08:00"
    const daysStr = scheduleStr.replace(timeStr, "").trim(); // e.g. "Mon, Wed, Fri"

    const lectureDays =
      daysStr === "Daily"
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        : daysStr
            .split(",")
            .map((d) => {
              const trim = d.trim().toLowerCase();
              if (trim.startsWith("mon")) return "Monday";
              if (trim.startsWith("tue")) return "Tuesday";
              if (trim.startsWith("wed")) return "Wednesday";
              if (trim.startsWith("thu")) return "Thursday";
              if (trim.startsWith("fri")) return "Friday";
              return "";
            })
            .filter(Boolean);

    let periodCode = "P1";
    if (timeStr.startsWith("08:00")) periodCode = "P1";
    else if (timeStr.startsWith("08:50")) periodCode = "P2";
    else if (timeStr.startsWith("09:40")) periodCode = "P3";
    else if (timeStr.startsWith("10:30") || timeStr.startsWith("10:40"))
      periodCode = "P4";
    else if (timeStr.startsWith("11:50") || timeStr.startsWith("11:30"))
      periodCode = "P5";
    else if (timeStr.startsWith("12:40") || timeStr.startsWith("12:20"))
      periodCode = "P6";
    else if (timeStr.startsWith("13:30") || timeStr.startsWith("01:10"))
      periodCode = "P7";
    else if (timeStr.startsWith("14:20") || timeStr.startsWith("02:00"))
      periodCode = "P8";

    for (const day of lectureDays) {
      parsedAssignments.push({
        day,
        periodCode,
        subjectName: sub.name,
        subjectId: sub.id,
        code: sub.code,
        room:
          assignment.room ||
          assignment.roomNumber ||
          sub.room ||
          studentClass.room ||
          "Room 101",
        teacherName: teacher ? teacher.name : "Faculty",
      });
    }
  }

  days.forEach((day) => {
    const daySubjects = [];

    slots.forEach((slot, slotIdx) => {
      if (slot.isBreak) {
        daySubjects.push({
          id: `${day}-${slotIdx}-break`,
          subject: slot.label,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: "Cafeteria / Courtyard",
          teacher: "Duty Staff",
          code: "BREAK",
          isBreak: true,
        });
      } else {
        // Find if there is a lecture scheduled for this class on this day at this period
        const lecture = parsedAssignments.find(
          (a) => a.day === day && a.periodCode === slot.periodCode,
        );

        if (lecture) {
          // Check if this is the Class Teacher's period (for Period 1 / Homeroom visual badge)
          const isHomeroom = slot.periodCode === "P1";

          daySubjects.push({
            id: `${day}-${slotIdx}`,
            subject: lecture.subjectName,
            startTime: slot.startTime,
            endTime: slot.endTime,
            room: lecture.room,
            teacher: lecture.teacherName,
            code: lecture.code || "SUB-00",
            isBreak: false,
            isHomeroom: isHomeroom,
          });
        } else {
          // Free Period
          daySubjects.push({
            id: `${day}-${slotIdx}-free`,
            subject: "Self Study",
            startTime: slot.startTime,
            endTime: slot.endTime,
            room: studentClass.room || "Library",
            teacher: "Supervising Staff",
            code: "FREE",
            isBreak: false,
            isFree: true,
          });
        }
      }
    });

    weekly[day] = daySubjects;
  });

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayTimetable = weekly[todayName] || weekly.Monday;

  return {
    today: todayTimetable,
    weekly: weekly,
  };
};

/**
 * Fetches curriculum details for a specific subject (Derived from Subject entity)
 */
const subjectCurriculums = {
  "sub-phy": {
    objectives: [
      "Analyze the fundamental principles of classical mechanics.",
      "Understand the laws of thermodynamics and heat transfer.",
      "Explore wave optics and physical optics principles.",
      "Conduct and analyze physics laboratory experiments with precision.",
    ],
    curriculum: [
      {
        unit: "Unit I: Physical World & Measurement",
        topics:
          "Units, dimensional analysis, error estimation and precision measurements.",
      },
      {
        unit: "Unit II: Kinematics & Laws of Motion",
        topics:
          "Vectors, motion in a plane, Newton's Laws, friction, circular motion.",
      },
      {
        unit: "Unit III: Work, Energy & Power",
        topics:
          "Kinetic and potential energy, work-energy theorem, elastic and inelastic collisions.",
      },
      {
        unit: "Unit IV: Thermodynamics",
        topics:
          "Thermal equilibrium, Zeroth, First, and Second laws of thermodynamics, heat engines.",
      },
    ],
    outcomes: [
      "Ability to solve complex multi-step physics mechanics problems.",
      "Understanding the mathematical representations of physical laws.",
      "Practical competence in analyzing experimental deviations.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Concepts of Physics - Vol I",
        author: "Dr. H.C. Verma",
      },
      {
        type: "reference",
        title: "Fundamentals of Physics",
        author: "Halliday & Resnick",
      },
    ],
  },
  "sub-chem": {
    objectives: [
      "Understand atomic structure and chemical bonding principles.",
      "Master the laws of stoichiometry and chemical reactions.",
      "Perform organic chemical reaction mechanisms analysis.",
      "Observe molecular interactions in laboratory environments.",
    ],
    curriculum: [
      {
        unit: "Unit I: Basic Concepts & Structure",
        topics:
          "Significant figures, atomic mass, mole concept, stoichiometry.",
      },
      {
        unit: "Unit II: Classification of Elements",
        topics:
          "Periodic table trends, ionization enthalpy, electronegativity, atomic radii.",
      },
      {
        unit: "Unit III: Chemical Bonding",
        topics:
          "Ionic and covalent bonds, Lewis structure, VSEPR theory, hybridization.",
      },
      {
        unit: "Unit IV: Organic Chemistry Basics",
        topics:
          "IUPAC nomenclature, inductive effect, resonance, electrophilic substitution.",
      },
    ],
    outcomes: [
      "Competency in balancing complex equations and calculating mole yields.",
      "Ability to predict molecular geometries using VSEPR.",
      "Understanding organic reaction mechanisms.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Modern Approach to Chemical Calculations",
        author: "R.C. Mukherjee",
      },
      {
        type: "reference",
        title: "Organic Chemistry",
        author: "Morrison & Boyd",
      },
    ],
  },
  "sub-math": {
    objectives: [
      "Apply calculus principles including limits, derivatives, and integrations.",
      "Formulate and solve algebraic and trigonometric systems.",
      "Master vector algebra and three-dimensional geometries.",
      "Model real-world scenarios using probability distributions.",
    ],
    curriculum: [
      {
        unit: "Unit I: Sets, Relations & Functions",
        topics:
          "Types of sets, Cartesian products, equivalence relations, injective/surjective functions.",
      },
      {
        unit: "Unit II: Trigonometry & Complex Numbers",
        topics:
          "Trigonometric identities, polar form of complex numbers, De Moivre's theorem.",
      },
      {
        unit: "Unit III: Calculus Foundations",
        topics:
          "Limits and continuity, derivatives, tangents and normals, basic integration rules.",
      },
      {
        unit: "Unit IV: Linear Programming",
        topics:
          "Graphical solution of linear inequalities, objective functions, optimization.",
      },
    ],
    outcomes: [
      "Ability to take limits and calculate derivatives of complex algebraic functions.",
      "Competency in solving linear programming optimization problems.",
      "Strong conceptual grasp of trigonometric transformations.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Mathematics for Class XI",
        author: "Dr. R.D. Sharma",
      },
      { type: "reference", title: "Higher Algebra", author: "Hall & Knight" },
    ],
  },
  "sub-cs": {
    objectives: [
      "Design algorithms and write clean, structured Python code.",
      "Apply fundamental object-oriented programming concepts.",
      "Utilize dynamic data structures such as lists, stacks, and queues.",
      "Understand database connectivity and structured queries (SQL).",
    ],
    curriculum: [
      {
        unit: "Unit I: Computational Thinking",
        topics:
          "Problem-solving methodologies, flowcharts, pseudocode, execution speeds.",
      },
      {
        unit: "Unit II: Core Python Programming",
        topics:
          "Data types, control flow, functions, file handling (text, CSV, binary).",
      },
      {
        unit: "Unit III: Data Structures",
        topics:
          "List operations, linear search, binary search, stacks implementation.",
      },
      {
        unit: "Unit IV: Databases & SQL",
        topics:
          "Relational database concepts, primary/foreign keys, SELECT queries, JOINs.",
      },
    ],
    outcomes: [
      "Ability to implement computational algorithms in Python.",
      "Hands-on competency in managing text and binary files.",
      "Writing optimized relational database queries.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Computer Science with Python",
        author: "Preeti Arora",
      },
      {
        type: "reference",
        title: "Python Programming: An Introduction",
        author: "John Zelle",
      },
    ],
  },
  "sub-eng": {
    objectives: [
      "Analyze literary devices and themes in prose and poetry.",
      "Improve formal written communication and report writing.",
      "Refine reading comprehension and critical analytical listening.",
      "Produce structured persuasive essays and formal letters.",
    ],
    curriculum: [
      {
        unit: "Unit I: Literature & Reading",
        topics:
          "Hornbill & Snapshots prose studies, poetry analysis, comprehension passages.",
      },
      {
        unit: "Unit II: Writing Skills",
        topics:
          "Notice writing, formal letter writing, poster making, report drafting.",
      },
      {
        unit: "Unit III: Grammar & Syntax",
        topics:
          "Tenses, active/passive voice, reordering sentences, error correction.",
      },
      {
        unit: "Unit IV: Creative Essay Writing",
        topics: "Argumentative essays, descriptive reports, narrative writing.",
      },
    ],
    outcomes: [
      "Strong mastery of formal business correspondence format.",
      "Critical literary appreciation of diverse English prose styles.",
      "Advanced conversational and written grammatical precision.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Hornbill: Textbook in English",
        author: "NCERT Editorial Board",
      },
      {
        type: "reference",
        title: "High School English Grammar & Composition",
        author: "Wren & Martin",
      },
    ],
  },
  "sub-acc": {
    objectives: [
      "Understand the double-entry bookkeeping system.",
      "Journalize business transactions and post them to ledgers.",
      "Prepare dynamic balance sheets and financial statements.",
      "Analyze depreciation policies and bank reconciliations.",
    ],
    curriculum: [
      {
        unit: "Unit I: Theoretical Framework",
        topics:
          "Accounting principles, double-entry concept, accounting standards.",
      },
      {
        unit: "Unit II: Recording Transactions",
        topics:
          "Journal entries, cash book, ledger posting, trial balance preparation.",
      },
      {
        unit: "Unit III: Financial Statements",
        topics:
          "Trading account, Profit & Loss statement, Balance Sheet with adjustments.",
      },
      {
        unit: "Unit IV: Depreciation & Provisions",
        topics: "Straight-line method, written-down value method, provisions.",
      },
    ],
    outcomes: [
      "Proficiency in balancing complex double-entry ledger accounts.",
      "Ability to compile corporate trading and profit/loss statements.",
      "Understanding audit trails and transaction reconciliations.",
    ],
    textbooks: [
      {
        type: "main",
        title: "Double Entry Book Keeping",
        author: "T.S. Grewal",
      },
      { type: "reference", title: "Financial Accounting", author: "D.K. Goel" },
    ],
  },
};

const getDetailsForSubject = (subject) => {
  const custom = subjectCurriculums[subject.id];
  if (custom) return custom;

  const name = subject.name;
  return {
    objectives: [
      `Develop a deep understanding of core concepts in ${name}.`,
      `Apply theoretical knowledge of ${name} to practical scenarios.`,
      `Engage in critical analysis of contemporary topics in ${name}.`,
      `Utilize research methodologies and textbooks to master ${name}.`,
    ],
    curriculum: [
      {
        unit: "Unit I: Foundations",
        topics: `Introduction to ${name}, basic paradigms, historical context.`,
      },
      {
        unit: "Unit II: Core Frameworks",
        topics: `Theoretical models, structural elements, practical methodologies.`,
      },
      {
        unit: "Unit III: Applied Methodologies",
        topics: `Case studies, operational workflows, systems analysis.`,
      },
      {
        unit: "Unit IV: Advanced Seminars",
        topics: `Future trends, synthesis of concepts, experimental reviews.`,
      },
    ],
    outcomes: [
      `Comprehensive conceptual mastery of ${name} principles.`,
      `Strong analytical problem-solving skills inside ${name}.`,
      `Ability to present structured academic reports on ${name}.`,
    ],
    textbooks: [
      {
        type: "main",
        title: `Textbook of ${name} for Class XI`,
        author: "Academic Board",
      },
      {
        type: "reference",
        title: `Comprehensive Guide to ${name}`,
        author: "Dr. A.K. Sharma",
      },
    ],
  };
};

export const getSubjectCurriculum = async (subjectId) => {
  const provider = getDataProvider();
  const subjects = await provider.getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const details = getDetailsForSubject(subject);

  return {
    title: subject.name,
    code: subject.code,
    classLevel: "Class 11",
    academicSession: "2024-25",
    teacher: subject.teachers?.[0] || "Faculty",
    description: subject.description,
    overview: subject.description,
    objectives: details.objectives,
    curriculum: details.curriculum,
    outcomes: details.outcomes,
    textbooks: details.textbooks,
  };
};

/**
 * Fetches all academic subjects available in the ERP
 */
export const getSubjects = async () => {
  const provider = getDataProvider();
  return await provider.getSubjects();
};

// ============================================================================
// NORMALIZED SUBJECT ARCHITECTURE HELPERS
// ============================================================================

/**
 * Check if a subject is an academic subject (graded)
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const checkIsAcademicSubject = (subjectId) => {
  return isAcademicSubject(subjectId);
};

/**
 * Check if a subject is an activity period (timetable-only, no grading)
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const checkIsActivityPeriod = (subjectId) => {
  return isActivityPeriod(subjectId);
};

/**
 * Check if a subject is optional
 * @param {string} subjectId - Subject identifier
 * @returns {boolean}
 */
export const checkIsOptionalSubject = (subjectId) => {
  return isOptionalSubject(subjectId);
};

/**
 * Get subject type category
 * @param {string} subjectId - Subject identifier
 * @returns {string} Subject type (academic, activity, optional)
 */
export const getSubjectType = (subjectId) => {
  if (isActivityPeriod(subjectId)) return SUBJECT_TYPES.ACTIVITY;
  if (isOptionalSubject(subjectId)) return SUBJECT_TYPES.OPTIONAL;
  if (isAcademicSubject(subjectId)) return SUBJECT_TYPES.ACADEMIC;
  return null;
};

/**
 * Get available optional subjects for Class 11
 * @returns {Array} Optional subject list
 */
export const getAvailableOptionalSubjects = () => {
  return getOptionalSubjects();
};

/**
 * Get available streams for Class 11-12
 * @returns {Array} Stream configurations
 */
export const getStreams = () => {
  return getAvailableStreams();
};

/**
 * Validate stream selection
 * @param {string} streamId - Stream identifier
 * @returns {boolean}
 */
export const validateStream = (streamId) => {
  return isValidStream(streamId);
};

/**
 * Get core subjects for a specific stream (without optional)
 * @param {string} streamId - Stream identifier
 * @returns {Array} Core subject objects
 */
export const getStreamCoreSubjects = (streamId) => {
  return getCoreSubjectsForStream(streamId);
};

/**
 * Get activity periods for timetable
 * @returns {Array} Activity period subjects
 */
export const getActivityPeriodSubjects = () => {
  return getActivityPeriods();
};

/**
 * Get subject details by ID
 * @param {string} subjectId - Subject identifier
 * @returns {Object|null} Subject object or null
 */
export const getSubjectDetails = (subjectId) => {
  return getSubjectById(subjectId);
};

/**
 * Get stream configuration
 * @param {string} streamId - Stream identifier
 * @returns {Object|null} Stream configuration or null
 */
export const getStreamDetails = (streamId) => {
  return getStreamConfig(streamId);
};
