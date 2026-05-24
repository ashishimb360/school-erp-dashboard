import { getDataProvider } from "../data";
import { getClassTeacherResponsibilities } from "./teacherScheduleService";
import { getAssignmentsByTeacher } from "./assignmentService";

/**
 * services/teacherActionCenterService.js
 *
 * Centralized service layer for aggregating daily tasks, alerts,
 * and operational workflows for teachers.
 * Optimized with in-memory caching and parallel fetching.
 */

// In-memory cache for action center items
const actionItemsCache = new Map();
const CACHE_TTL = 4000; // 4 seconds short-lived cache

/**
 * Invalidate the action items cache.
 */
export const clearActionCenterCache = (teacherId) => {
  if (teacherId) {
    actionItemsCache.delete(teacherId);
  } else {
    actionItemsCache.clear();
  }
};

export const getAttendanceAlerts = async (teacherId) => {
  const responsibilities = await getClassTeacherResponsibilities(teacherId);
  if (!responsibilities || responsibilities.attendanceMarked) return null;

  return {
    id: "action-attendance-pending",
    type: "ATTENDANCE",
    severity: "HIGH",
    message: `Attendance for your Class ${responsibilities.className} is pending for today!`,
    actionLabel: "Take Attendance",
    link: "/teacher/attendance",
  };
};

export const getPendingLeaves = async (teacherId) => {
  const responsibilities = await getClassTeacherResponsibilities(teacherId);
  if (!responsibilities || responsibilities.pendingLeavesCount === 0)
    return null;

  return {
    id: "action-leaves-pending",
    type: "LEAVE",
    severity: "HIGH",
    message: `You have ${responsibilities.pendingLeavesCount} student leave request(s) awaiting approval.`,
    actionLabel: "Review Leaves",
    link: "/teacher/leave-management",
  };
};

export const getMentorRequests = async (teacherId) => {
  const tId = teacherId || "teach-001";
  const provider = getDataProvider();
  // Query all pending mentor sessions for this teacher
  const sessions = await provider.getMentorSessionsByTeacher(tId);
  const pendingSessions = sessions.filter((s) => s.status === "PENDING");
  if (pendingSessions.length === 0) return null;

  return {
    id: "action-mentors-pending",
    type: "MENTORSHIP",
    severity: "MEDIUM",
    message: `You have ${pendingSessions.length} student mentorship session request(s) awaiting review.`,
    actionLabel: "Open Requests",
    link: "/teacher/mentorship",
  };
};

export const getPendingGrading = async (teacherId) => {
  const tId = teacherId || "teach-001";
  const teacherAssignments = await getAssignmentsByTeacher(tId);

  let totalPendingGrading = 0;
  for (const asgn of teacherAssignments) {
    const pendingForAsgn =
      (asgn.submissionsCount || 0) - (asgn.gradedCount || 0);
    if (pendingForAsgn > 0) {
      totalPendingGrading += pendingForAsgn;
    }
  }

  if (totalPendingGrading === 0) return null;

  return {
    id: "action-grading-pending",
    type: "GRADING",
    severity: "LOW",
    message: `You have ${totalPendingGrading} submission(s) across your classes pending evaluation.`,
    actionLabel: "Grade Homework",
    link: "/teacher/assignments",
  };
};

export const getUrgentInstitutionalUpdates = async () => {
  return [
    {
      id: "action-policy-update",
      type: "ADMIN",
      severity: "MEDIUM",
      message:
        "Quarterly report card entry guidelines have been updated by Administration.",
      actionLabel: "View Notice",
      link: "/teacher/dashboard",
    },
  ];
};

export const getTeacherActionItems = async (teacherId) => {
  const tId = teacherId || "teach-001";

  // 1. Return from cache if hot
  if (actionItemsCache.has(tId)) {
    const entry = actionItemsCache.get(tId);
    if (Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.actions;
    }
  }

  console.time(`[PERF AUDIT] getTeacherActionItems for ${tId}`);

  // 2. Parallelize alerts extraction to prevent waterfall queries
  const [attAlert, leaveAlert, mentorAlert, gradeAlert, adminUpdates] =
    await Promise.all([
      getAttendanceAlerts(tId),
      getPendingLeaves(tId),
      getMentorRequests(tId),
      getPendingGrading(tId),
      getUrgentInstitutionalUpdates(),
    ]);

  const actions = [];
  if (attAlert) actions.push(attAlert);
  if (leaveAlert) actions.push(leaveAlert);
  if (mentorAlert) actions.push(mentorAlert);
  if (gradeAlert) actions.push(gradeAlert);
  if (adminUpdates && adminUpdates.length > 0) {
    actions.push(...adminUpdates);
  }

  console.timeEnd(`[PERF AUDIT] getTeacherActionItems for ${tId}`);

  // Cache
  actionItemsCache.set(tId, {
    actions,
    timestamp: Date.now(),
  });

  return actions;
};

export const teacherActionCenterService = {
  getAttendanceAlerts,
  getPendingLeaves,
  getMentorRequests,
  getPendingGrading,
  getUrgentInstitutionalUpdates,
  getTeacherActionItems,
  clearActionCenterCache,
};
