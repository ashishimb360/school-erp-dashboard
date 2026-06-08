/**
 * Teacher Contracts
 * Defines the strict boundaries for teacher-related payloads.
 */
export const TeacherContract = {
  createTeacherProfile(data) {
    return {
      id: data?.id ?? '',
      employeeId: data?.employeeId ?? '',
      name: data?.name ?? '',
      department: data?.department ?? '',
      subjects: Array.isArray(data?.subjects) ? data.subjects : [],
      classesAssigned: Array.isArray(data?.classesAssigned) ? data.classesAssigned : []
    };
  },
  createTeacherDashboard(data) {
    return {
      teacherId: data?.teacherId ?? '',
      todayClasses: Array.isArray(data?.todayClasses) ? data.todayClasses : [],
      pendingEvaluations: data?.pendingEvaluations ?? 0,
      notices: Array.isArray(data?.notices) ? data.notices : []
    };
  }
};
