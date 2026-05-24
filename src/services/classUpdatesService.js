import { getDataProvider } from "../data";
import { clearServiceCache } from "../hooks/useService";

/**
 * classUpdatesService.js
 *
 * Centralized service layer for targeted Class Updates and Academic Communications.
 * Derives student and parent visibility relational paths from one shared source of truth.
 */

// Cache clearing helper
export const clearUpdatesCaches = () => {
  clearServiceCache(getUpdatesForTeacher);
  clearServiceCache(getUpdatesForStudent);
  clearServiceCache(getUpdatesForParent);
};

/**
 * Get all updates published by a specific teacher, sorted chronologically.
 */
export const getUpdatesForTeacher = async (teacherId) => {
  const tId = teacherId || "teach-001";
  const provider = getDataProvider();
  const updates = await provider.getClassUpdates();
  const teacherUpdates = updates.filter((u) => u.teacherId === tId);
  return teacherUpdates.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
};

/**
 * Get all updates visible to a student based on their class.
 */
export const getUpdatesForStudent = async (studentId, isParent = false) => {
  if (!studentId) return [];
  const provider = getDataProvider();
  const students = await provider.getStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student || !student.classId) return [];

  const updates = await provider.getClassUpdates();
  const classUpdates = updates.filter((u) => u.classId === student.classId);
  const targetRole = isParent ? "PARENT" : "STUDENT";

  // Filter for dynamic role visibility scope and sort chronologically
  return classUpdates
    .filter((u) => u.visibility.includes(targetRole))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get all updates visible to a parent based on their children's classes.
 */
export const getUpdatesForParent = async (parentId) => {
  if (!parentId) return [];
  const provider = getDataProvider();
  const parents = await provider.getParents();
  const parent = parents.find((p) => p.id === parentId);
  if (!parent || !parent.childIds) return [];

  // Resolve children to find their class mappings
  const students = await provider.getStudents();
  const children = parent.childIds
    .map((id) => students.find((s) => s.id === id))
    .filter(Boolean);

  const childClassIds = new Set(
    children.map((c) => c?.classId).filter(Boolean),
  );
  if (childClassIds.size === 0) return [];

  const allUpdates = await provider.getClassUpdates();

  // Filter for updates matching child classes, containing PARENT visibility, and sort chronologically
  return allUpdates
    .filter(
      (u) => childClassIds.has(u.classId) && u.visibility.includes("PARENT"),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Create a new targeted class academic update.
 * Verifies relational teacher authority before inserting.
 */
export const createClassUpdate = async ({
  teacherId,
  classId,
  subjectId,
  title,
  message,
  category,
  visibility,
  priority,
}) => {
  if (!teacherId) throw new Error("Teacher credentials are required.");
  if (!classId) throw new Error("Target class is required.");
  if (!subjectId) throw new Error("Target subject is required.");
  if (!title || title.trim() === "") throw new Error("Title cannot be empty.");
  if (!message || message.trim() === "")
    throw new Error("Message cannot be empty.");
  if (!category) throw new Error("Category is required.");
  if (!visibility || visibility.length === 0)
    throw new Error("At least one visibility scope is required.");
  if (!priority) throw new Error("Priority level is required.");

  const provider = getDataProvider();
  // Fetch teacher details
  const teachers = await provider.getTeachers();
  const teacher = teachers.find((t) => t.id === teacherId);
  if (!teacher) throw new Error("Teacher profile not found.");

  // ── Dynamic Relational Authority Validation ──
  const classesList = await provider.getClasses();
  const homeroomClass = classesList.find((c) => c.classTeacherId === teacherId);
  const isHomeroomTeacher = homeroomClass && homeroomClass.id === classId;

  if (isHomeroomTeacher) {
    // Class teachers can post general or coordination announcements to their homeroom.
    // Otherwise, validate that they teach the specific subject to this homeroom class.
    if (subjectId !== "general" && subjectId !== "homeroom") {
      const assignments = await provider.getTeacherSubjectAssignments();
      const classAssignments = assignments.filter(
        (a) =>
          a.teacherId === teacherId &&
          a.classId === classId &&
          a.subjectId === subjectId,
      );
      if (classAssignments.length === 0) {
        throw new Error(
          "Relational Authority Violated: You do not teach this subject to this class.",
        );
      }
    }
  } else {
    // Subject Teacher: must be assigned to instruct this class and teach the specified subject
    if (subjectId === "general" || subjectId === "homeroom") {
      throw new Error(
        "Relational Authority Violated: Only the assigned Class Teacher is authorized to post general or homeroom notices.",
      );
    }

    const assignments = await provider.getTeacherSubjectAssignments();
    const classAssignments = assignments.filter(
      (a) =>
        a.teacherId === teacherId &&
        a.classId === classId &&
        a.subjectId === subjectId,
    );
    if (classAssignments.length === 0) {
      throw new Error(
        "Relational Authority Violated: You do not teach this subject to this class.",
      );
    }
  }

  // Resolve entity names for readable display
  const classObj = classesList.find((c) => c.id === classId);
  let subjectObj = null;
  if (subjectId === "general" || subjectId === "homeroom") {
    subjectObj = { name: "General Notice" };
  } else {
    const subjects = await provider.getSubjects();
    subjectObj = subjects.find((s) => s.id === subjectId);
  }

  const nextId = `upd-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newUpdate = await provider.createClassUpdate({
    id: nextId,
    teacherId,
    teacherName: teacher.name,
    classId,
    className: classObj ? classObj.name : classId,
    subjectId,
    subjectName: subjectObj ? subjectObj.name : subjectId,
    title,
    message,
    category,
    visibility,
    priority,
  });

  // Clear caches to trigger dynamic components updates
  clearUpdatesCaches();

  return newUpdate;
};

/**
 * Delete an update.
 * Confirms original publisher teacher authority before removing.
 */
export const deleteClassUpdate = async (updateId, teacherId) => {
  if (!updateId) throw new Error("Update ID is required.");
  if (!teacherId) throw new Error("Teacher ID is required.");
  const provider = getDataProvider();

  const allUpdates = await provider.getClassUpdates();
  const update = allUpdates.find((u) => u.id === updateId);
  if (!update) throw new Error("Academic update not found.");

  if (update.teacherId !== teacherId) {
    throw new Error(
      "Relational Authority Violated: You are not the publisher of this update.",
    );
  }

  const result = await provider.deleteClassUpdate(updateId);
  clearUpdatesCaches();
  return result;
};

/**
 * Filter updates by class.
 */
export const getUpdatesByClass = async (classId) => {
  const provider = getDataProvider();
  const allUpdates = await provider.getClassUpdates();
  return allUpdates.filter((u) => u.classId === classId);
};

/**
 * Filter updates by category.
 */
export const getUpdatesByCategory = async (category) => {
  const provider = getDataProvider();
  const allUpdates = await provider.getClassUpdates();
  return allUpdates.filter((u) => u.category === category);
};
