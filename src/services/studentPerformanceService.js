import { getDataProvider } from "../data";
import { getAttendanceSummary, getAttendanceTrend } from "./attendanceService";
import { getStudentAssignments } from "./assignmentService";
import { getStudentResults } from "./examService";
import { getLeavesByStudent } from "./leaveService";
import { getRemarksByStudent } from "./mentorshipService";
import { clearServiceCache } from "../hooks/useService";

/**
 * studentPerformanceService.js
 *
 * Centralized aggregation layer for Academic Progress Monitoring.
 * Pulls relational updates dynamically without duplicating data.
 */

// Cache clearing helper
export const clearPerformanceCaches = () => {
  clearServiceCache(getStudentsForTeacher);
  clearServiceCache(getStudentPerformanceDetails);
  clearServiceCache(getAcademicOverview);
};

export const getStudentsForTeacher = async (teacherId) => {
  const id = teacherId || "teach-001";
  const provider = getDataProvider();
  const teachers = await provider.getTeachers();
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) return [];

  const assignments = await provider.getTeacherSubjectAssignments();
  const teacherAssignments = assignments.filter((a) => a.teacherId === id);
  const uniqueClassIds = [...new Set(teacherAssignments.map((a) => a.classId))];

  const allClassDefinitions = await provider.getClasses();
  const homeroomClass = allClassDefinitions.find((c) => c.classTeacherId === id);

  const teacherClasses = new Set([
    ...uniqueClassIds,
    ...(homeroomClass ? [homeroomClass.id] : []),
  ]);

  const allStudents = await provider.getStudents();

  // Filter students whose classId is within teacher's scope
  const filteredStudents = allStudents.filter((student) =>
    teacherClasses.has(student.classId),
  );

  return filteredStudents.map((student) => {
    const cls = allClassDefinitions.find((c) => c.id === student.classId);
    return {
      ...student,
      className: cls ? cls.name : student.classId,
      streamName: student.streamId
        ? student.streamId.replace(/_/g, " ")
        : "N/A",
    };
  });
};

/**
 * Generates an aggregated academic summary for a single student.
 * Derives performance status and warning flags dynamically.
 */
export const getStudentPerformanceSummary = async (studentId) => {
  // 1. Attendance percentage
  const attSummary = await getAttendanceSummary(studentId);
  const attendancePct = attSummary.percentage;

  // 2. Assignment completion
  const assignments = await getStudentAssignments(studentId);
  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter((a) =>
    ["SUBMITTED", "REVIEWED", "GRADED"].includes(a.status),
  ).length;
  const pendingAssignments = totalAssignments - submittedAssignments;
  const overdueAssignments = assignments.filter(
    (a) => a.status === "OVERDUE",
  ).length;

  // 3. Average Marks
  const results = await getStudentResults(studentId);
  const academicResults = results.filter(
    (r) => r.marksObtained !== null && r.maxMarks !== null,
  );

  let averageMarksPct = 0;
  if (academicResults.length > 0) {
    const totalObtained = academicResults.reduce(
      (sum, r) => sum + r.marksObtained,
      0,
    );
    const totalMax = academicResults.reduce((sum, r) => sum + r.maxMarks, 0);
    averageMarksPct =
      totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  }

  // 4. Leave Statistics
  const leaves = await getLeavesByStudent(studentId);
  const approvedLeavesCount = leaves.filter(
    (l) => l.status === "APPROVED",
  ).length;

  // 5. Dynamic Warning Flags System
  const flags = [];
  if (attendancePct < 75) {
    flags.push({
      type: "DANGER",
      label: "Attendance Warning",
      description: `Attendance is critically low at ${attendancePct}% (Threshold is 75%).`,
    });
  } else if (attendancePct < 85) {
    flags.push({
      type: "WARNING",
      label: "Low Attendance",
      description: `Attendance has dipped to ${attendancePct}%.`,
    });
  }

  if (overdueAssignments > 0) {
    flags.push({
      type: "DANGER",
      label: "Academic Concern",
      description: `${overdueAssignments} assignment(s) are overdue.`,
    });
  } else if (pendingAssignments >= 3) {
    flags.push({
      type: "WARNING",
      label: "Pending Tasks",
      description: `Has ${pendingAssignments} pending assignments.`,
    });
  }

  if (academicResults.length > 0 && averageMarksPct < 65) {
    flags.push({
      type: "DANGER",
      label: "Performance Drop",
      description: `Term average marks are low at ${averageMarksPct}%.`,
    });
  } else if (academicResults.length > 0 && averageMarksPct < 75) {
    flags.push({
      type: "WARNING",
      label: "Needs Improvement",
      description: `Term average marks are currently ${averageMarksPct}%.`,
    });
  }

  if (approvedLeavesCount >= 3) {
    flags.push({
      type: "WARNING",
      label: "Monitoring Needed",
      description: `Frequent leave usage: ${approvedLeavesCount} approved leaves.`,
    });
  }

  // Determine overall status
  let status = "Excellent";
  const hasDanger = flags.some((f) => f.type === "DANGER");
  const hasWarning = flags.some((f) => f.type === "WARNING");

  if (hasDanger) {
    status = "At Risk";
  } else if (hasWarning) {
    status = "Warning";
  } else if (attendancePct >= 90 && averageMarksPct >= 85) {
    status = "Excellent";
  } else {
    status = "Good";
  }

  return {
    studentId,
    attendancePct,
    totalAssignments,
    submittedAssignments,
    pendingAssignments,
    overdueAssignments,
    averageMarksPct,
    approvedLeavesCount,
    flags,
    status,
  };
};

/**
 * Fetches comprehensive detail panel sections for a student.
 */
export const getStudentPerformanceDetails = async (studentId) => {
  const [
    attendanceSummary,
    attendanceTrend,
    assignments,
    results,
    leaves,
    remarks,
  ] = await Promise.all([
    getAttendanceSummary(studentId),
    getAttendanceTrend(studentId),
    getStudentAssignments(studentId),
    getStudentResults(studentId),
    getLeavesByStudent(studentId),
    getRemarksByStudent(studentId),
  ]);

  const summary = await getStudentPerformanceSummary(studentId);

  return {
    studentId,
    summary,
    attendance: {
      percentage: attendanceSummary.percentage,
      totalClasses: attendanceSummary.totalClasses,
      attended: attendanceSummary.attended,
      trend: attendanceTrend,
    },
    assignments: {
      list: assignments,
      total: assignments.length,
      submitted: assignments.filter((a) =>
        ["SUBMITTED", "REVIEWED", "GRADED"].includes(a.status),
      ).length,
      overdue: assignments.filter((a) => a.status === "OVERDUE").length,
      pending: assignments.filter((a) =>
        ["PENDING", "DUE_SOON"].includes(a.status),
      ).length,
    },
    marks: {
      results: results,
    },
    leaves: {
      list: leaves,
    },
    remarks: {
      list: remarks,
    },
  };
};

/**
 * Aggregates analytical statistics for top dashboard summary cards.
 */
export const getAcademicOverview = async (teacherId) => {
  const students = await getStudentsForTeacher(teacherId);
  const totalMonitored = students.length;

  if (totalMonitored === 0) {
    return {
      totalMonitored: 0,
      lowAttendanceCount: 0,
      pendingAssignmentsCount: 0,
      alertsCount: 0,
      studentsData: [],
    };
  }

  // Aggregate summaries asynchronously
  const studentsWithSummary = await Promise.all(
    students.map(async (student) => {
      const summary = await getStudentPerformanceSummary(student.id);
      return {
        ...student,
        summary,
      };
    }),
  );

  const lowAttendanceCount = studentsWithSummary.filter(
    (s) => s.summary.attendancePct < 75,
  ).length;
  const pendingAssignmentsCount = studentsWithSummary.reduce(
    (sum, s) => sum + s.summary.overdueAssignments,
    0,
  );
  const alertsCount = studentsWithSummary.reduce(
    (sum, s) => sum + s.summary.flags.length,
    0,
  );

  return {
    totalMonitored,
    lowAttendanceCount,
    pendingAssignmentsCount,
    alertsCount,
    studentsData: studentsWithSummary,
  };
};
