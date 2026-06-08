/**
 * Student Contracts
 * Defines the strict boundaries for student-related payloads.
 */
export const StudentContract = {
  createStudentProfile(data) {
    return {
      id: data?.id ?? '',
      admissionNo: data?.admissionNo ?? '',
      name: data?.name ?? '',
      classId: data?.classId ?? '',
      className: data?.className ?? '',
      streamId: data?.streamId ?? null,
      parentId: data?.parentId ?? null
    };
  },
  createStudentDashboard(data) {
    return {
      studentId: data?.studentId ?? '',
      attendancePercentage: data?.attendancePercentage ?? 0,
      upcomingExams: Array.isArray(data?.upcomingExams) ? data.upcomingExams : [],
      pendingAssignments: Array.isArray(data?.pendingAssignments) ? data.pendingAssignments : []
    };
  }
};
