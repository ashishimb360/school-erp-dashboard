/**
 * Academic Contracts
 * Groups assignments, exams, question papers, and timetables.
 */
export const AcademicContract = {
  createAssignment(data) {
    return {
      id: data?.id ?? '',
      title: data?.title ?? '',
      subjectId: data?.subjectId ?? '',
      classId: data?.classId ?? '',
      dueDate: data?.dueDate ?? '',
      status: data?.status ?? 'Pending'
    };
  },
  createQuestionPaper(data) {
    return {
      id: data?.id ?? '',
      title: data?.title ?? '',
      classId: data?.classId ?? '',
      section: data?.section ?? '',
      subjectId: data?.subjectId ?? '',
      teacherId: data?.teacherId ?? '',
      status: data?.status ?? 'Draft',
      content: data?.content ?? '',
      uploadedFile: data?.uploadedFile ?? null,
      remarks: data?.remarks ?? '',
      createdAt: data?.createdAt ?? new Date().toISOString(),
      updatedAt: data?.updatedAt ?? new Date().toISOString()
    };
  },
  createExamResult(data) {
    return {
      examId: data?.examId ?? '',
      studentId: data?.studentId ?? '',
      aggregatePercentage: data?.aggregatePercentage ?? 0,
      subjectMarks: Array.isArray(data?.subjectMarks) ? data.subjectMarks : []
    };
  }
};
