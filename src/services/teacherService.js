import { getDataProvider } from "../data";
import { facultyData } from "../data/teachers/faculty";
import {
  mentorProfile,
  quickResources,
  sessionHistory,
  supportCategories,
} from "../data/teachers/mentors";
import { emitEvent, WORKFLOW_EVENTS } from "./workflowEvents";

/**
 * services/teacherService.js
 * Service abstraction for faculty and operational teacher workflows
 */

// --- RESTORED LEGACY EXPORTS (Top Priority to fix HMR) ---
export const getMentorResources = async () => quickResources;
export const getMentors = async () => mentorProfile;
export const getMentorSessions = async () => sessionHistory;
export const getFaculty = async () => facultyData;
export const getMentorCategories = async () => supportCategories;
export const getMentorshipData = async () => {
  return {
    mentorProfile,
    supportCategories,
    quickResources,
    sessionHistory,
  };
};

// --- NEW RELATIONAL OPERATIONAL EXPORTS ---

/**
 * Fetches the teacher profile and assigned homeroom class (attendance authority).
 * Only the homeroom class can be used for marking attendance.
 */
export const getTeacherWorkload = async (teacherId) => {
  const id = teacherId || "teach-001";
  const provider = getDataProvider();

  const teachers = await provider.getTeachers();
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return null;

  // Homeroom is the class this teacher is the CLASS TEACHER of (attendance authority)
  const classes = await provider.getClasses();
  const homeroomClass = classes.find((c) => c.classTeacherId === id) || null;

  // Derive teaching classes dynamically from the relational assignments database
  const assignments = await provider.getTeacherSubjectAssignments();
  const teacherAssignments = assignments.filter((a) => a.teacherId === id);
  const uniqueClassIds = [...new Set(teacherAssignments.map((a) => a.classId))];

  const allClasses = uniqueClassIds
    .map((classId) => classes.find((c) => c.id === classId))
    .filter(Boolean);

  return {
    profile: teacher,
    homeroomClass, // The class where this teacher marks attendance
    classes: allClasses, // All subject-teaching assignments
  };
};

/**
 * Checks if a teacher is the class teacher of a given class (attendance authority check)
 */
export const isClassTeacher = async (teacherId, classId) => {
  const provider = getDataProvider();
  const classes = await provider.getClasses();
  const cls = classes.find((c) => c.id === classId);
  return cls?.classTeacherId === teacherId;
};

/**
 * Fetches students in a specific class
 */
export const getStudentsInClass = async (classId) => {
  const provider = getDataProvider();
  const students = await provider.getStudents();
  return students.filter((s) => s.classId === classId);
};

import { getClassAttendance, updateClassAttendance } from "./attendanceService";

/**
 * Submits attendance for a class
 */
export const submitAttendance = async (
  teacherId,
  classId,
  attendanceList,
  date,
) => {
  const provider = getDataProvider();
  const classes = await provider.getClasses();
  const cls = classes.find((c) => c.id === classId);
  if (!cls) throw new Error("Class not found.");
  if (cls.classTeacherId !== teacherId) {
    throw new Error(
      "Relational Authority Violated: Only the assigned Homeroom Class Teacher is authorized to mark daily attendance.",
    );
  }

  const submitDate = date || new Date().toISOString().split("T")[0];
  const records = attendanceList.map((item) => ({
    studentId: item.studentId,
    classId: classId,
    date: submitDate,
    status: item.status.toUpperCase(), // Map 'present', 'absent' to 'PRESENT', 'ABSENT'
    markedBy: teacherId,
  }));

  return await updateClassAttendance(records, classId, submitDate, teacherId);
};

/**
 * Fetches existing attendance for a class on a specific date
 */
export const getAttendanceForClass = async (classId, date) => {
  const records = await getClassAttendance(classId, date);
  // Map back the status to lowercase for Teacher UI if needed
  return records.map((r) => ({
    ...r,
    status: r.status.toLowerCase(),
  }));
};

/**
 * Fetches attendance session metadata for a class
 */
export const getAttendanceSessionForClass = async (classId, date) => {
  const { getAttendanceSession } = await import("./attendanceService");
  return await getAttendanceSession(classId, date);
};

/**
 * Fetches existing marks for a class, subject, and exam
 */
export const getMarksForClass = async (classId, subjectId, examId) => {
  const provider = getDataProvider();
  const results = await provider.getResults();
  return results.filter(
    (r) =>
      r.classId === classId && r.subjectId === subjectId && r.examId === examId,
  );
};

/**
 * Submits marks for a list of students
 */
export const submitMarks = async (
  teacherId,
  classId,
  subjectId,
  examId,
  marksList,
  publishResults = false,
) => {
  const provider = getDataProvider();
  const records = marksList.map((item) => ({
    studentId: item.studentId,
    classId: classId,
    subjectId: subjectId,
    examId: examId,
    marksObtained: parseFloat(item.marks),
    maxMarks: parseFloat(item.maxMarks || 100),
    remarks: item.remarks || "",
    grade: calculateGrade(item.marks, item.maxMarks || 100),
    teacherId: teacherId,
  }));

  const results = await provider.getResults();
  records.forEach(async (record) => {
    const existingIdx = results.findIndex(
      (r) =>
        r.studentId === record.studentId &&
        r.examId === record.examId &&
        r.subjectId === record.subjectId,
    );

    if (existingIdx !== -1) {
      await provider.updateResult(results[existingIdx].id, record);
    } else {
      await provider.createResult(record);
    }
  });

  // Emit event for result publication
  if (publishResults) {
    const exam = await provider.getExamById(examId);
    emitEvent(WORKFLOW_EVENTS.RESULT_PUBLISHED, {
      examId,
      examName: exam?.name || "Examination",
      classIds: exam?.classIds || [],
      subjectId,
      publishedDate: new Date().toISOString(),
      sourceModule: "examinations",
      createdBy: teacherId,
    });
  }

  return true;
};

/**
 * Simple grade calculator
 */
const calculateGrade = (marks, max) => {
  const percentage = (marks / max) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

/**
 * Fetches the complete detailed professional teacher profile relationally.
 */
export const getTeacherProfile = async (teacherId) => {
  const tId = teacherId || "teach-001";
  const provider = getDataProvider();

  const teachers = await provider.getTeachers();
  const teacher = teachers.find((t) => t.id === tId);
  if (!teacher) return null;

  // Resolve assigned class & subjects
  const assignments = await provider.getTeacherSubjectAssignments();
  const teacherAssignments = assignments.filter((a) => a.teacherId === tId);

  const subjects = await provider.getSubjects();
  const classes = await provider.getClasses();

  const assignedSubjects = [];
  for (const assignment of teacherAssignments) {
    const sub = subjects.find((s) => s.id === assignment.subjectId);
    const cls = classes.find((c) => c.id === assignment.classId);
    if (sub && cls) {
      assignedSubjects.push({
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        classId: cls.id,
        className: cls.name,
        displayName: cls.displayName,
        schedule: assignment.schedule || sub.schedule || "N/A",
        room: assignment.room || sub.room || cls.room || "N/A",
      });
    }
  }

  // Resolve Class Teacher ownership
  const homeroomClass = classes.find((c) => c.classTeacherId === tId) || null;

  // Resolve Mentorship count
  const mentorAssignments = await provider.getMentorAssignments();
  const teacherMentors = mentorAssignments.filter(
    (ma) => ma.mentorTeacherId === tId,
  );

  return {
    ...teacher,
    assignedSubjects,
    isClassTeacher: !!homeroomClass,
    homeroomClass,
    mentorshipCount: teacherMentors.length,
  };
};

/**
 * Updates editable contact and professional fields for the logged-in teacher.
 */
export const updateTeacherProfile = async (teacherId, updates) => {
  const tId = teacherId || "teach-001";
  const provider = getDataProvider();

  const teachers = await provider.getTeachers();
  const idx = teachers.findIndex((t) => t.id === tId);
  if (idx === -1) throw new Error("Teacher not found");

  // Enforce validation: teachers can only edit allowed personal & professional fields
  const allowedUpdates = {};
  const editableKeys = [
    "phoneNumber",
    "email",
    "emergencyContact",
    "address",
    "dob",
    "gender",
    "qualification",
    "experience",
    "certifications",
    "subjectSpecialization",
  ];

  editableKeys.forEach((key) => {
    if (updates[key] !== undefined) {
      allowedUpdates[key] = updates[key];
    }
  });

  const updatedTeacher = await provider.updateTeacher(tId, allowedUpdates);
  return updatedTeacher;
};

export const getAllTeachers = async () => {
  const provider = getDataProvider();
  return await provider.getTeachers();
};

export {
  getTeacherType,
  getTeacherSpecialization,
  getClassTeacher,
  getSubjectTeachersForClass,
  getTeacherAssignments,
  getEligibleClassTeachers,
  validateTeacherAssignment,
  validateClassTeacherChange,
  auditTeacherSpecializations,
  auditClassTeacherAssignments,
  getTeacherTypeSummary,
} from "./teacherMappingService";
