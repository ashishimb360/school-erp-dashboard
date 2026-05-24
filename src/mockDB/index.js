import { engine } from "./core/engine";
import { setItem, getItem } from "../persistence/storage";
import { STORAGE_KEYS } from "../persistence/storageKeys";

/**
 * MockDB Central Instance (Storage-Backed Facade)
 *
 * Provides a unified query & mutation interface. Directly routes all queries 
 * and mutations through the centralized localStorage persistence layer.
 * This completely avoids in-memory cached state desynchronization.
 */

// Helper to pull the collection directly from centralized persistence
const getCollection = (key, fallback = []) => {
  return getItem(key) || fallback;
};

export const MockDB = {
  // Collection Accessors
  students: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.STUDENTS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.STUDENTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.STUDENTS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.STUDENTS)),
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.STUDENTS);
      const idx = list.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Student not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.STUDENTS, list);
      return list[idx];
    },
  },

  authUsers: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.AUTH_USERS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.AUTH_USERS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.AUTH_USERS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.AUTH_USERS)),
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.AUTH_USERS);
      const idx = list.findIndex(
        (u) => u.id === id || u.linkedEntityId === id
      );
      if (idx === -1) throw new Error("User account not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.AUTH_USERS, list);
      return list[idx];
    },
  },

  teachers: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.TEACHERS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.TEACHERS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.TEACHERS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.TEACHERS)),
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.TEACHERS);
      const idx = list.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error("Teacher not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.TEACHERS, list);
      return list[idx];
    },
  },

  classes: {
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.CLASSES), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLASSES)),
  },

  subjects: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.SUBJECTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.SUBJECTS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.SUBJECTS)),
  },

  teacherSubjectAssignments: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.TEACHER_SUBJECT_ASSIGNMENTS)),
  },

  dailyAttendance: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.DAILY_ATTENDANCE), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.DAILY_ATTENDANCE), query),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.DAILY_ATTENDANCE);
      const existingIdx = list.findIndex(
        (a) =>
          a.studentId === record.studentId &&
          a.date === record.date &&
          a.classId === record.classId
      );

      let returnedRecord;
      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          ...record,
        };
        returnedRecord = list[existingIdx];
      } else {
        const newRecord = {
          ...record,
          id: `att_${record.studentId}_${record.date}`,
        };
        list.push(newRecord);
        returnedRecord = newRecord;
      }

      setItem(STORAGE_KEYS.DAILY_ATTENDANCE, list);
      return returnedRecord;
    },
  },

  attendanceSessions: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.ATTENDANCE_SESSIONS), query),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.ATTENDANCE_SESSIONS);
      const existingIdx = list.findIndex(
        (s) => s.classId === record.classId && s.date === record.date
      );
      let returnedRecord;
      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          ...record,
        };
        returnedRecord = list[existingIdx];
      } else {
        const newRecord = {
          ...record,
          id: `sess_${record.classId}_${record.date}`,
        };
        list.push(newRecord);
        returnedRecord = newRecord;
      }
      setItem(STORAGE_KEYS.ATTENDANCE_SESSIONS, list);
      return returnedRecord;
    },
  },

  attendance: {
    find: (query) => engine.where(getCollection("erp_attendance"), query),
    insert: async (record) => {
      const list = getCollection("erp_attendance");
      const existingIdx = list.findIndex(
        (a) =>
          a.studentId === record.studentId &&
          a.date === record.date &&
          a.classId === record.classId
      );

      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          ...record,
        };
        setItem("erp_attendance", list);
        return list[existingIdx];
      }

      const newRecord = { ...record, id: `att-${Date.now()}` };
      list.push(newRecord);
      setItem("erp_attendance", list);
      return newRecord;
    },
  },

  fees: {
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.FEES), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.FEES)),
  },

  parents: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.PARENTS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.PARENTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.PARENTS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.PARENTS)),
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.PARENTS);
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Parent not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.PARENTS, list);
      return list[idx];
    },
  },

  admins: {
    all: () =>
      Promise.resolve(
        getCollection(STORAGE_KEYS.AUTH_USERS).filter((u) => u.role === "admin" || u.role === "ADMIN")
      ),
    findById: (id) =>
      Promise.resolve(
        getCollection(STORAGE_KEYS.AUTH_USERS).find((u) => u.id === id || u.linkedEntityId === id)
      ),
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.AUTH_USERS);
      const idx = list.findIndex(
        (u) => u.id === id || u.linkedEntityId === id
      );
      if (idx === -1) throw new Error("Admin not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.AUTH_USERS, list);
      return list[idx];
    },
  },

  exams: {
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.EXAMS)),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.EXAMS), id),
  },

  results: {
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.RESULTS)),
    find: (query) => engine.where(getCollection(STORAGE_KEYS.RESULTS), query),
    insertMany: async (records) => {
      const list = getCollection(STORAGE_KEYS.RESULTS);
      records.forEach((record) => {
        const existingIdx = list.findIndex(
          (r) =>
            r.studentId === record.studentId &&
            r.examId === record.examId &&
            r.subjectId === record.subjectId
        );

        if (existingIdx !== -1) {
          list[existingIdx] = { ...list[existingIdx], ...record };
        } else {
          list.push({
            ...record,
            id: `res-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          });
        }
      });

      setItem(STORAGE_KEYS.RESULTS, list);
      return true;
    },
  },

  assignments: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.ASSIGNMENTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.ASSIGNMENTS), id),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.ASSIGNMENTS)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.ASSIGNMENTS);
      const newRecord = { ...record, id: record.id || `asgn-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.ASSIGNMENTS, list);
      return newRecord;
    },
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.ASSIGNMENTS);
      const idx = list.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Assignment not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.ASSIGNMENTS, list);
      return list[idx];
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.ASSIGNMENTS);
      const idx = list.findIndex((a) => a.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);

      const submissionsList = getCollection(STORAGE_KEYS.SUBMISSIONS);
      const remainingSubmissions = submissionsList.filter(
        (s) => s.assignmentId !== id
      );

      setItem(STORAGE_KEYS.SUBMISSIONS, remainingSubmissions);
      setItem(STORAGE_KEYS.ASSIGNMENTS, list);
      return true;
    },
  },

  submissions: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.SUBMISSIONS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.SUBMISSIONS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.SUBMISSIONS)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.SUBMISSIONS);
      const newRecord = { ...record, id: record.id || `subm-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.SUBMISSIONS, list);
      return newRecord;
    },
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.SUBMISSIONS);
      const idx = list.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Submission not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.SUBMISSIONS, list);
      return list[idx];
    },
    upsertSubmission: async (record) => {
      const list = getCollection(STORAGE_KEYS.SUBMISSIONS);
      const idx = list.findIndex(
        (s) =>
          s.assignmentId === record.assignmentId &&
          s.studentId === record.studentId
      );
      let returnedRecord;
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...record };
        returnedRecord = list[idx];
      } else {
        const newRecord = { ...record, id: record.id || `subm-${Date.now()}` };
        list.push(newRecord);
        returnedRecord = newRecord;
      }
      setItem(STORAGE_KEYS.SUBMISSIONS, list);
      return returnedRecord;
    },
  },

  streams: {
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.STREAMS)),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.STREAMS), id),
  },

  transport: {
    findAssignment: (query) => engine.findOne(getCollection(STORAGE_KEYS.TRANSPORT_ASSIGNMENTS), query),
    findRoute: (query) => engine.findOne(getCollection(STORAGE_KEYS.TRANSPORT_ROUTES), query),
    findVehicle: (query) => engine.findOne(getCollection(STORAGE_KEYS.TRANSPORT_VEHICLES), query),
    findDriver: (query) => engine.findOne(getCollection(STORAGE_KEYS.TRANSPORT_DRIVERS), query),
    findAlerts: (query) => engine.where(getCollection(STORAGE_KEYS.TRANSPORT_ALERTS), query),
    allRoutes: () => Promise.resolve(getCollection(STORAGE_KEYS.TRANSPORT_ROUTES)),
    allAlerts: () => Promise.resolve(getCollection(STORAGE_KEYS.TRANSPORT_ALERTS)),
  },

  documents: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.DOCUMENTS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.DOCUMENTS)),
  },

  achievements: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.ACHIEVEMENTS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.ACHIEVEMENTS)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.ACHIEVEMENTS);
      const newRecord = { ...record, id: record.id || `ach-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.ACHIEVEMENTS, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.ACHIEVEMENTS);
      const idx = list.findIndex((a) => a.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);
      setItem(STORAGE_KEYS.ACHIEVEMENTS, list);
      return true;
    },
  },

  invoices: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.INVOICES), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.INVOICES)),
  },

  receipts: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.RECEIPTS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.RECEIPTS)),
  },

  notices: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.NOTICES), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.NOTICES)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.NOTICES);
      const newRecord = { ...record, id: record.id || `notice-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.NOTICES, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.NOTICES);
      const idx = list.findIndex((n) => n.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);
      setItem(STORAGE_KEYS.NOTICES, list);
      return true;
    },
  },

  events: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.EVENTS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.EVENTS)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.EVENTS);
      const newRecord = { ...record, id: record.id || `eve-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.EVENTS, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.EVENTS);
      const idx = list.findIndex((e) => e.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);
      setItem(STORAGE_KEYS.EVENTS, list);
      return true;
    },
  },

  clubs: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLUBS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLUBS)),
  },

  clubEnrollments: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLUB_ENROLLMENTS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLUB_ENROLLMENTS)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.CLUB_ENROLLMENTS);
      const newRecord = { ...record, id: record.id || `enroll-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.CLUB_ENROLLMENTS, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.CLUB_ENROLLMENTS);
      const idx = list.findIndex((e) => e.id === id);
      if (idx === -1) return false;
      list.splice(idx, 1);
      setItem(STORAGE_KEYS.CLUB_ENROLLMENTS, list);
      return true;
    },
  },

  clubActivities: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLUB_ACTIVITIES), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLUB_ACTIVITIES)),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.CLUB_ACTIVITIES);
      const newRecord = { ...record, id: record.id || `act-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.CLUB_ACTIVITIES, list);
      return newRecord;
    },
  },

  clubCoordinators: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLUB_COORDINATORS), query),
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLUB_COORDINATORS)),
  },

  leaveRequests: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.LEAVE_REQUESTS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.LEAVE_REQUESTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.LEAVE_REQUESTS), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.LEAVE_REQUESTS);
      const newRecord = { ...record, id: record.id || `leave-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.LEAVE_REQUESTS, list);
      return newRecord;
    },
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.LEAVE_REQUESTS);
      const idx = list.findIndex((l) => l.id === id);
      if (idx === -1) throw new Error("Leave request not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.LEAVE_REQUESTS, list);
      return list[idx];
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.LEAVE_REQUESTS)),
  },

  mentorRemarks: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.MENTOR_REMARKS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.MENTOR_REMARKS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.MENTOR_REMARKS), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.MENTOR_REMARKS);
      const newRecord = { ...record, id: record.id || `rem-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.MENTOR_REMARKS, list);
      return newRecord;
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.MENTOR_REMARKS)),
  },

  mentorAssignments: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.MENTOR_ASSIGNMENTS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.MENTOR_ASSIGNMENTS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.MENTOR_ASSIGNMENTS), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.MENTOR_ASSIGNMENTS);
      const newRecord = { ...record, id: record.id || `mase-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.MENTOR_ASSIGNMENTS, list);
      return newRecord;
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.MENTOR_ASSIGNMENTS)),
  },

  mentorSessions: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.MENTOR_SESSIONS), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.MENTOR_SESSIONS), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.MENTOR_SESSIONS), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.MENTOR_SESSIONS);
      const newRecord = { ...record, id: record.id || `sess-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.MENTOR_SESSIONS, list);
      return newRecord;
    },
    update: async (id, updates) => {
      const list = getCollection(STORAGE_KEYS.MENTOR_SESSIONS);
      const idx = list.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Session not found");
      list[idx] = { ...list[idx], ...updates };
      setItem(STORAGE_KEYS.MENTOR_SESSIONS, list);
      return list[idx];
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.MENTOR_SESSIONS)),
  },

  classUpdates: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLASS_UPDATES), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.CLASS_UPDATES), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.CLASS_UPDATES), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.CLASS_UPDATES);
      const newRecord = { ...record, id: record.id || `upd-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.CLASS_UPDATES, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.CLASS_UPDATES);
      const idx = list.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("Update not found");
      const deleted = list.splice(idx, 1)[0];
      setItem(STORAGE_KEYS.CLASS_UPDATES, list);
      return deleted;
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLASS_UPDATES)),
  },

  clubUpdates: {
    find: (query) => engine.where(getCollection(STORAGE_KEYS.CLUB_UPDATES), query),
    findOne: (query) => engine.findOne(getCollection(STORAGE_KEYS.CLUB_UPDATES), query),
    findById: (id) => engine.findById(getCollection(STORAGE_KEYS.CLUB_UPDATES), id),
    insert: async (record) => {
      const list = getCollection(STORAGE_KEYS.CLUB_UPDATES);
      const newRecord = { ...record, id: record.id || `clupd-${Date.now()}` };
      list.push(newRecord);
      setItem(STORAGE_KEYS.CLUB_UPDATES, list);
      return newRecord;
    },
    delete: async (id) => {
      const list = getCollection(STORAGE_KEYS.CLUB_UPDATES);
      const idx = list.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("Update not found");
      const deleted = list.splice(idx, 1)[0];
      setItem(STORAGE_KEYS.CLUB_UPDATES, list);
      return deleted;
    },
    all: () => Promise.resolve(getCollection(STORAGE_KEYS.CLUB_UPDATES)),
  },

  // Relationship Resolvers (Dynamic joins against direct storage reads)
  helpers: {
    resolveClass: (student) =>
      engine.resolveOne(student, "classId", getCollection(STORAGE_KEYS.CLASSES)),
    resolveAttendance: (student) =>
      engine.resolveMany(student, "id", getCollection("erp_attendance"), "studentId"),
    resolveResults: (student) =>
      engine.resolveMany(student, "id", getCollection(STORAGE_KEYS.RESULTS), "studentId"),
    resolveStudentsInClass: (classId) =>
      getCollection(STORAGE_KEYS.STUDENTS).filter((s) => s.classId === classId),

    // Analytics Helpers
    getClassAverage: (classId, subjectId, examId) => {
      const classResults = getCollection(STORAGE_KEYS.RESULTS).filter(
        (r) =>
          r.classId === classId &&
          r.subjectId === subjectId &&
          r.examId === examId
      );
      if (classResults.length === 0) return 0;
      const total = classResults.reduce((sum, r) => sum + r.marksObtained, 0);
      return (total / classResults.length).toFixed(1);
    },

    getTopper: (classId, subjectId, examId) => {
      const classResults = getCollection(STORAGE_KEYS.RESULTS).filter(
        (r) =>
          r.classId === classId &&
          r.subjectId === subjectId &&
          r.examId === examId
      );
      if (classResults.length === 0) return null;
      return classResults.reduce((prev, current) =>
        prev.marksObtained > current.marksObtained ? prev : current
      );
    },

    getStudentWeakAreas: (studentId) => {
      const studentResults = getCollection(STORAGE_KEYS.RESULTS).filter(
        (r) => r.studentId === studentId
      );
      return studentResults
        .filter((r) => r.marksObtained / r.maxMarks < 0.6)
        .map((r) => ({
          subjectId: r.subjectId,
          score: r.marksObtained,
          examId: r.examId,
        }));
    },
  },
};
