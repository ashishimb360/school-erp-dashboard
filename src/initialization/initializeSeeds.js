/**
 * initialization/initializeSeeds.js
 * Evaluates whether the ERP runtime collections are empty and
 * bootstraps static, relation-complete institutional seed data.
 */

import { STORAGE_KEYS } from "../persistence/storageKeys";
import { getItem, setItem } from "../persistence/storage";
import { seedData } from "../mockDB/seed/initialData";

// New Validation Layer
import { diagnosticEngine } from "./validators/diagnosticEngine";
import { validateAcademicIntegrity } from "./validators/academicValidator";
import { validateStaffingAndWorkload } from "./validators/staffingValidator";
import { validateTimetableSafety } from "./validators/timetableValidator";

const SEED_VERSION = "v20"; // v20: Fee Structure — admin-configurable per-class/stream fee templates with class-aware invoice generation

export const initializeSeeds = {
  /**
   * Evaluates collections and populates localStorage if they are empty/missing.
   * Ensures first-load seeding happens precisely once.
   * @param {boolean} force - Force re-seeding regardless of current storage contents
   */
  checkAndSeed: (force = false) => {
    const students = getItem(STORAGE_KEYS.STUDENTS);
    const teachers = getItem(STORAGE_KEYS.TEACHERS);
    const authUsers = getItem(STORAGE_KEYS.AUTH_USERS);
    const classes = getItem(STORAGE_KEYS.CLASSES);
    const storedSeedVersion = getItem("erp_seed_version");

    const needsSeeding =
      force ||
      storedSeedVersion !== SEED_VERSION ||
      !students ||
      students.length === 0 ||
      !teachers ||
      teachers.length === 0 ||
      !authUsers ||
      authUsers.length === 0 ||
      !classes ||
      classes.length === 0;

    if (!needsSeeding) {
      return false;
    }

    console.log(
      "[InitializationEngine] Initializing clean institutional database seed data...",
    );

    // Define temporary clean database schema registry
    const db = {
      users: [],
      students: [],
      teachers: [],
      parents: [],
      classes: [],
      subjects: [],
      attendance: [],
      assignments: [],
      fees: [],
      notices: [],
      events: [],
      exams: [],
      examPapers: [],
      results: [],
      submissions: [],
      streams: [],
      transportRoutes: [],
      transportAssignments: [],
      transportVehicles: [],
      transportDrivers: [],
      transportAlerts: [],
      documents: [],
      achievements: [],
      invoices: [],
      receipts: [],
      clubs: [],
      clubEnrollments: [],
      clubActivities: [],
      clubCoordinators: [],
      dailyAttendance: [],
      attendanceSessions: [],
      leaveRequests: [],
      mentorRemarks: [],
      mentorAssignments: [],
      mentorSessions: [],
      classUpdates: [],
      clubUpdates: [],
      teacherSubjectAssignments: [],
      authUsers: [],
      periods: [],
      rooms: [],
      academicCalendar: null,
      feeStructures: [],
      teacherDocuments: [],
    };

    // Run high-fidelity relational seed generator
    seedData(db);

    // ==========================================
    // Phase 2: Relational Integrity Validation
    // ==========================================
    diagnosticEngine.reset();

    // Academic & Staffing checks
    validateAcademicIntegrity(
      db.classes,
      db.teacherSubjectAssignments,
      db.teachers,
      db.subjects,
      db.streams,
    );
    validateStaffingAndWorkload(
      db.teachers,
      db.teacherSubjectAssignments,
      db.classes,
    );

    // We parse the legacy timetable seed to pass to the timetable validator
    // Note: teacherSubjectAssignmentsSeed in timetable.js is what is exported, but wait, it's not in db.timetable.
    // Wait, the timetable is not actually stored in the db registry in initialData.js right now.
    // It's handled dynamically via localProvider.getTimetable() returning "erp_timetable_v1".
    // We'll validate the in-memory array if it exists.
    // For now, we will just parse it out of the raw timetable seed.
    import("../mockDB/seed/timetable")
      .then(({ teacherSubjectAssignmentsSeed }) => {
        validateTimetableSafety(
          teacherSubjectAssignmentsSeed,
          db.teacherSubjectAssignments,
        );
        diagnosticEngine.printSummary();
      })
      .catch((err) => {
        console.warn("Could not load timetable seed for validation", err);
        diagnosticEngine.printSummary();
      });

    // Persist all populated tables atomically to localStorage
    const persistMap = {
      [STORAGE_KEYS.STUDENTS]: db.students,
      [STORAGE_KEYS.TEACHERS]: db.teachers,
      [STORAGE_KEYS.PARENTS]: db.parents,
      [STORAGE_KEYS.AUTH_USERS]: db.authUsers,
      [STORAGE_KEYS.CLASSES]: db.classes,
      [STORAGE_KEYS.SUBJECTS]: db.subjects,
      [STORAGE_KEYS.STREAMS]: db.streams,
      [STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS]: db.teacherSubjectAssignments,
      [STORAGE_KEYS.DAILY_ATTENDANCE]: db.dailyAttendance,
      [STORAGE_KEYS.ATTENDANCE_SESSIONS]: db.attendanceSessions,
      [STORAGE_KEYS.EXAMS]: db.exams,
      [STORAGE_KEYS.EXAM_PAPERS]: db.examPapers,
      [STORAGE_KEYS.RESULTS]: db.results,
      [STORAGE_KEYS.ASSIGNMENTS]: db.assignments,
      [STORAGE_KEYS.SUBMISSIONS]: db.submissions,
      [STORAGE_KEYS.FEES]: db.fees,
      [STORAGE_KEYS.FEE_STRUCTURES]: db.feeStructures || [],
      [STORAGE_KEYS.TEACHER_DOCUMENTS]: db.teacherDocuments || [],
      [STORAGE_KEYS.INVOICES]: db.invoices,
      [STORAGE_KEYS.RECEIPTS]: db.receipts,
      [STORAGE_KEYS.TRANSPORT_ROUTES]: db.transportRoutes,
      [STORAGE_KEYS.TRANSPORT_VEHICLES]: db.transportVehicles,
      [STORAGE_KEYS.TRANSPORT_DRIVERS]: db.transportDrivers,
      [STORAGE_KEYS.TRANSPORT_ASSIGNMENTS]: db.transportAssignments,
      [STORAGE_KEYS.TRANSPORT_ALERTS]: db.transportAlerts,
      [STORAGE_KEYS.DOCUMENTS]: db.documents,
      [STORAGE_KEYS.ACHIEVEMENTS]: db.achievements,
      [STORAGE_KEYS.NOTICES]: db.notices,
      [STORAGE_KEYS.EVENTS]: db.events,
      [STORAGE_KEYS.CLUBS]: db.clubs,
      [STORAGE_KEYS.CLUB_ENROLLMENTS]: db.clubEnrollments,
      [STORAGE_KEYS.CLUB_ACTIVITIES]: db.clubActivities,
      [STORAGE_KEYS.CLUB_COORDINATORS]: db.clubCoordinators,
      [STORAGE_KEYS.CLUB_UPDATES]: db.clubUpdates,
      [STORAGE_KEYS.MENTOR_REMARKS]: db.mentorRemarks,
      [STORAGE_KEYS.MENTOR_ASSIGNMENTS]: db.mentorAssignments,
      [STORAGE_KEYS.MENTOR_SESSIONS]: db.mentorSessions,
      [STORAGE_KEYS.CLASS_UPDATES]: db.classUpdates,
      [STORAGE_KEYS.LEAVE_REQUESTS]: db.leaveRequests,
      [STORAGE_KEYS.PERIODS]: db.periods || [],
      [STORAGE_KEYS.ROOMS]: db.rooms || [],
    };

    Object.entries(persistMap).forEach(([key, list]) => {
      setItem(key, list || []);
    });

    // Persist academic calendar separately (object, not array)
    setItem(STORAGE_KEYS.ACADEMIC_CALENDAR, db.academicCalendar || null);

    // Stamp seed version to prevent re-seeding on reload
    setItem("erp_seed_version", SEED_VERSION);

    // Stamp baseline schema versions for migrations safety
    setItem(STORAGE_KEYS.STUDENTS_SCHEMA_VERSION, "v5");
    setItem("erp_teachers_schema_version", "v2");
    setItem("erp_classes_schema_version", "v2");
    setItem("erp_results_schema_version", "v2");
    setItem("erp_assignments_schema_version", "v1");
    setItem("erp_submissions_schema_version", "v1");

    console.log(
      "[InitializationEngine] Database seeding completed successfully.",
    );
    return true;
  },
};

export default initializeSeeds;
