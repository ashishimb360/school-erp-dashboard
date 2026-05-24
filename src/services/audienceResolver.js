/**
 * Audience Resolution Utility
 * Centralized logic for determining notice recipients based on context
 */

import { AUDIENCE_TYPES } from "../mockDB/seed/notices";
import { getDataProvider } from "../data/providers/localProvider";

/**
 * Resolve audience for a notice based on context
 * @param {Object} context - The context object with class, subject, student, etc.
 * @param {Object} options - Resolution options
 * @returns {Object} The targetAudience object
 */
export async function resolveAudience(context, options = {}) {
  const {
    classId,
    subjectId,
    studentId,
    teacherId,
    parentId,
    stream,
    busRoute,
    includeStudents = true,
    includeParents = true,
    includeTeachers = true,
  } = context;

  const provider = getDataProvider();

  // If specific IDs are provided, use SPECIFIC audience type
  if (studentId && studentId.length > 0) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      studentIds: Array.isArray(studentId) ? studentId : [studentId],
    };
  }

  if (parentId && parentId.length > 0) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds: Array.isArray(parentId) ? parentId : [parentId],
    };
  }

  if (teacherId && teacherId.length > 0) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      teacherIds: Array.isArray(teacherId) ? teacherId : [teacherId],
    };
  }

  // If class ID is provided, use CLASS audience type
  if (classId) {
    const audience = {
      type: AUDIENCE_TYPES.CLASS,
      classIds: Array.isArray(classId) ? classId : [classId],
    };

    // Add subject filter if provided
    if (subjectId) {
      audience.subjectIds = Array.isArray(subjectId) ? subjectId : [subjectId];
    }

    return audience;
  }

  // If bus route is provided, use SPECIFIC audience with parent IDs
  if (busRoute) {
    const allStudents = await provider.getStudents();
    const studentsOnRoute = allStudents.filter(
      (s) => s.transport?.route === busRoute,
    );
    const parentIds = studentsOnRoute.map((s) => s.parentId).filter(Boolean);

    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds,
    };
  }

  // If stream is provided, resolve classes by stream
  if (stream) {
    const allClasses = await provider.getClasses();
    const streamClasses = allClasses.filter((c) => c.stream === stream);
    const classIds = streamClasses.map((c) => c.id);

    return {
      type: AUDIENCE_TYPES.CLASS,
      classIds,
    };
  }

  // Default to ALL if no specific context
  return {
    type: AUDIENCE_TYPES.ALL,
  };
}

/**
 * Resolve audience for exam-related notices
 * @param {Object} examData - The exam data
 * @returns {Object} The targetAudience object
 */
export async function resolveExamAudience(examData) {
  const { classIds, subjectId, examType, targetTeachers } = examData;

  if (examType === "practical" && subjectId) {
    // For practical exams, target students of that subject
    return {
      type: AUDIENCE_TYPES.CLASS,
      classIds,
      subjectIds: [subjectId],
    };
  }

  // For theory exams, target all students in the classes
  return {
    type: AUDIENCE_TYPES.CLASS,
    classIds,
  };
}

/**
 * Resolve audience for evaluation-related notices (teachers only)
 * @param {Object} evaluationData - The evaluation data
 * @returns {Object} The targetAudience object
 */
export async function resolveEvaluationAudience(evaluationData) {
  const { subjectId, classId, teacherId } = evaluationData;

  // If specific teacher is provided, target only that teacher
  if (teacherId) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      teacherIds: [teacherId],
    };
  }

  // If subject and class are provided, target the subject teacher for that class
  if (subjectId && classId) {
    const provider = getDataProvider();
    const assignments = await provider.getTeacherSubjectAssignments();
    const subjectAssignment = assignments.find(
      (a) => a.subjectId === subjectId && a.classId === classId,
    );

    if (subjectAssignment) {
      return {
        type: AUDIENCE_TYPES.SPECIFIC,
        teacherIds: [subjectAssignment.teacherId],
      };
    }
  }

  // Default to all teachers
  return {
    type: AUDIENCE_TYPES.TEACHERS,
  };
}

/**
 * Resolve audience for attendance-related notices
 * @param {Object} attendanceData - The attendance data
 * @returns {Object} The targetAudience object
 */
export async function resolveAttendanceAudience(attendanceData) {
  const { studentId, classId, percentage } = attendanceData;

  // For individual student attendance warnings
  if (studentId) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      studentIds: [studentId],
    };
  }

  // For class-wide attendance alerts
  if (classId) {
    return {
      type: AUDIENCE_TYPES.CLASS,
      classIds: [classId],
    };
  }

  // Default to ALL
  return {
    type: AUDIENCE_TYPES.ALL,
  };
}

/**
 * Resolve audience for fee-related notices
 * @param {Object} feeData - The fee data
 * @returns {Object} The targetAudience object
 */
export async function resolveFeeAudience(feeData) {
  const { parentId, classId, overdueOnly } = feeData;

  // For specific parent fee reminders
  if (parentId) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds: Array.isArray(parentId) ? parentId : [parentId],
    };
  }

  // For class-wide fee reminders
  if (classId) {
    const provider = getDataProvider();
    const students = await provider.getStudents();
    const classStudents = students.filter((s) => s.classId === classId);
    const parentIds = classStudents.map((s) => s.parentId).filter(Boolean);

    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds,
    };
  }

  // Default to all parents
  return {
    type: AUDIENCE_TYPES.PARENTS,
  };
}

/**
 * Resolve audience for PTM-related notices
 * @param {Object} ptmData - The PTM data
 * @returns {Object} The targetAudience object
 */
export async function resolvePTMAudience(ptmData) {
  const { classIds, targetTeachers } = ptmData;

  const audience = {
    type: AUDIENCE_TYPES.CLASS,
    classIds: Array.isArray(classIds) ? classIds : [classIds],
  };

  // If specific teachers are targeted
  if (targetTeachers && targetTeachers.length > 0) {
    audience.teacherIds = targetTeachers;
  }

  return audience;
}

/**
 * Resolve audience for assignment-related notices
 * @param {Object} assignmentData - The assignment data
 * @returns {Object} The targetAudience object
 */
export async function resolveAssignmentAudience(assignmentData) {
  const { classId, subjectId } = assignmentData;

  return {
    type: AUDIENCE_TYPES.CLASS,
    classIds: [classId],
    subjectIds: [subjectId],
  };
}

/**
 * Resolve audience for transport-related notices
 * @param {Object} transportData - The transport data
 * @returns {Object} The targetAudience object
 */
export async function resolveTransportAudience(transportData) {
  const { routeNumber, parentId } = transportData;

  // For specific parent transport updates
  if (parentId) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds: Array.isArray(parentId) ? parentId : [parentId],
    };
  }

  // For route-wide updates
  if (routeNumber) {
    const provider = getDataProvider();
    const allStudents = await provider.getStudents();
    const studentsOnRoute = allStudents.filter(
      (s) => s.transport?.route === routeNumber,
    );
    const parentIds = studentsOnRoute.map((s) => s.parentId).filter(Boolean);

    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      parentIds,
    };
  }

  // Default to all parents of students using transport
  const provider = getDataProvider();
  const allStudents = await provider.getStudents();
  const transportStudents = allStudents.filter((s) => s.transport?.busNo);
  const parentIds = transportStudents.map((s) => s.parentId).filter(Boolean);

  return {
    type: AUDIENCE_TYPES.SPECIFIC,
    parentIds,
  };
}

/**
 * Resolve audience for result-related notices
 * @param {Object} resultData - The result data
 * @returns {Object} The targetAudience object
 */
export async function resolveResultAudience(resultData) {
  const { classIds, studentId } = resultData;

  // For individual student results
  if (studentId) {
    return {
      type: AUDIENCE_TYPES.SPECIFIC,
      studentIds: [studentId],
    };
  }

  // For class-wide result announcements
  if (classIds) {
    return {
      type: AUDIENCE_TYPES.CLASS,
      classIds: Array.isArray(classIds) ? classIds : [classIds],
    };
  }

  // Default to ALL
  return {
    type: AUDIENCE_TYPES.ALL,
  };
}

/**
 * Expand audience to include related users
 * For example, if students are targeted, also include their parents
 * @param {Object} targetAudience - The targetAudience object
 * @param {Object} options - Expansion options
 * @returns {Object} The expanded targetAudience object
 */
export async function expandAudience(targetAudience, options = {}) {
  const { includeParents = false, includeTeachers = false } = options;
  const provider = getDataProvider();

  if (targetAudience.type === AUDIENCE_TYPES.CLASS && includeParents) {
    const students = await provider.getStudents();
    const classStudents = students.filter((s) =>
      targetAudience.classIds.includes(s.classId),
    );
    const parentIds = classStudents.map((s) => s.parentId).filter(Boolean);

    return {
      ...targetAudience,
      parentIds,
    };
  }

  if (targetAudience.type === AUDIENCE_TYPES.CLASS && includeTeachers) {
    const teachers = await provider.getTeachers();
    const classTeachers = teachers.filter((t) =>
      t.assignedClasses?.some((c) => targetAudience.classIds.includes(c)),
    );
    const teacherIds = classTeachers.map((t) => t.id);

    return {
      ...targetAudience,
      teacherIds,
    };
  }

  return targetAudience;
}
