import { getDataProvider } from "../data";

/**
 * applyLeave
 * Submits a new leave request.
 */
export const applyLeave = async ({
  studentId,
  classId,
  reason,
  fromDate,
  toDate,
}) => {
  // Validate empty reason
  if (!reason || reason.trim() === "") {
    throw new Error("Reason for leave cannot be empty.");
  }

  // Validate date range
  if (!fromDate || !toDate) {
    throw new Error("Please specify both From and To dates.");
  }
  if (new Date(toDate) < new Date(fromDate)) {
    throw new Error("To Date cannot be before From Date.");
  }

  // Validate past leave beyond reasonable range (e.g. 7 days in the past)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const inputFromDate = new Date(fromDate);

  // Set time elements to midnight to perform calendar day comparisons accurately
  sevenDaysAgo.setHours(0, 0, 0, 0);
  inputFromDate.setHours(0, 0, 0, 0);

  if (inputFromDate < sevenDaysAgo) {
    throw new Error(
      "Cannot apply for retroactive leave beyond 7 days in the past.",
    );
  }

  // Get student's class and teacher
  const provider = getDataProvider();
  const students = await provider.getStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) throw new Error("Student not found.");

  const classes = await provider.getClasses();
  const cls = classes.find((c) => c.id === (classId || student.classId));
  if (!cls) throw new Error("Class not found.");

  const classTeacherId = cls.classTeacherId;

  const newRequest = {
    studentId,
    classId: classId || student.classId,
    appliedTo: classTeacherId,
    reason,
    startDate: fromDate,
    endDate: toDate,
  };

  return await provider.createLeaveRequest(newRequest);
};

/**
 * getLeaveRequestsByStudent
 */
export const getLeaveRequestsByStudent = async (studentId) => {
  const provider = getDataProvider();
  return await provider.getLeaveRequestsByStudent(studentId);
};

/**
 * getLeaveRequestsForTeacher
 * Only returns requests where the teacher is classTeacher of the class
 */
export const getLeaveRequestsForTeacher = async (teacherId) => {
  const provider = getDataProvider();
  return await provider.getLeaveRequestsForTeacher(teacherId);
};

/**
 * approveLeave
 */
export const approveLeave = async (leaveId) => {
  const provider = getDataProvider();
  return await provider.updateLeaveRequest(leaveId, {
    status: "APPROVED",
    reviewedAt: new Date().toISOString(),
  });
};

/**
 * rejectLeave
 */
export const rejectLeave = async (leaveId, teacherId, comment = "") => {
  const provider = getDataProvider();
  const leave = await provider.getLeaveRequest(leaveId);
  if (!leave) throw new Error("Leave request not found.");
  if (leave.appliedTo !== teacherId) {
    throw new Error(
      "Unauthorized: Only the assigned class teacher can reject this request.",
    );
  }
  return await provider.updateLeaveRequest(leaveId, {
    status: "REJECTED",
    reviewedAt: new Date().toISOString(),
    reviewedBy: teacherId,
    teacherComment: comment,
  });
};

/**
 * getLeaveRequests
 */
export const getLeaveRequests = async () => {
  const provider = getDataProvider();
  return await provider.getLeaveRequests();
};

/**
 * getLeaveStatus
 */
export const getLeaveStatus = async (leaveId) => {
  const provider = getDataProvider();
  return await provider.getLeaveRequest(leaveId);
};

/**
 * getApprovedLeavesByDate
 */
export const getApprovedLeavesByDate = async (date) => {
  const provider = getDataProvider();
  const leaves = await provider.getLeaveRequests();
  return leaves.filter(
    (leave) =>
      leave.status === "APPROVED" &&
      leave.startDate <= date &&
      leave.endDate >= date,
  );
};

/**
 * isStudentOnApprovedLeave
 */
export const isStudentOnApprovedLeave = async (studentId, date) => {
  const provider = getDataProvider();
  const leaves = await provider.getLeaveRequestsByStudent(studentId);
  const leave = leaves.find(
    (l) => l.status === "APPROVED" && l.startDate <= date && l.endDate >= date,
  );
  return leave ? leave : null;
};

/**
 * syncApprovedLeaveToAttendance
 */
export const syncApprovedLeaveToAttendance = async (
  studentId,
  startDate,
  endDate,
) => {
  const provider = getDataProvider();
  const leaves = await provider.getLeaveRequestsByStudent(studentId);
  const leave = leaves.find(
    (l) =>
      l.status === "APPROVED" &&
      l.startDate === startDate &&
      l.endDate === endDate,
  );
  if (!leave) return;

  const attendance = await provider.getDailyAttendance();
  const dates = getDateRange(startDate, endDate);

  dates.forEach(async (date) => {
    const existingIdx = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === date,
    );
    if (existingIdx !== -1) {
      await provider.markAttendance({
        studentId,
        classId: attendance[existingIdx].classId,
        status: "LEAVE",
        markedBy: leave.appliedTo,
        date,
      });
    } else {
      await provider.markAttendance({
        studentId,
        classId: leave.classId || "",
        status: "LEAVE",
        markedBy: leave.appliedTo,
        date,
      });
    }
  });
};

/**
 * revertLeaveFromAttendance
 */
export const revertLeaveFromAttendance = async (
  studentId,
  startDate,
  endDate,
) => {
  const provider = getDataProvider();
  const leaves = await provider.getLeaveRequestsByStudent(studentId);
  const leave = leaves.find(
    (l) =>
      l.status === "REJECTED" &&
      l.startDate === startDate &&
      l.endDate === endDate,
  );
  if (!leave) return;

  const attendance = await provider.getDailyAttendance();
  const dates = getDateRange(startDate, endDate);

  dates.forEach(async (date) => {
    const existingIdx = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === date,
    );
    if (existingIdx !== -1 && attendance[existingIdx].status === "LEAVE") {
      await provider.markAttendance({
        studentId,
        classId: attendance[existingIdx].classId,
        status: "UNMARKED",
        markedBy: null,
        date,
      });
    }
  });
};

/**
 * Get all dates between two dates (inclusive) in YYYY-MM-DD format
 */
const getDateRange = (startDate, endDate) => {
  const dates = [];
  let curr = new Date(startDate);
  const end = new Date(endDate);
  while (curr <= end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

// Backward compatibility alias for LeavePage
export const getLeavesByStudent = getLeaveRequestsByStudent;

// Backward compatibility alias for LeaveMgmtPage
export const getLeavesForTeacherApproval = getLeaveRequestsForTeacher;
