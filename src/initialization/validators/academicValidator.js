/**
 * src/initialization/validators/academicValidator.js
 * 
 * Validates academic rules and relational integrity for classes and assignments.
 */

import { diagnosticEngine } from "./diagnosticEngine";

export const validateAcademicIntegrity = (classes, assignments, teachers, subjects, streams) => {
  const MODULE = "AcademicValidator";

  // Build lookup maps
  const teacherMap = new Map(teachers.map(t => [t.id, t]));
  const subjectMap = new Map(subjects.map(s => [s.subjectId || s.id, s]));
  const streamMap = new Map(streams.map(s => [s.streamId || s.id, s]));
  
  // Group assignments by class
  const classAssignments = new Map();
  for (const asn of assignments) {
    if (!classAssignments.has(asn.classId)) {
      classAssignments.set(asn.classId, []);
    }
    classAssignments.get(asn.classId).push(asn);
  }

  for (const cls of classes) {
    const clsAssignments = classAssignments.get(cls.classId || cls.id) || [];
    
    // Check if class has zero assignments
    if (clsAssignments.length === 0) {
      diagnosticEngine.critical(MODULE, `Class ${cls.className || cls.classId} has no teacher assignments.`, { classId: cls.classId });
      continue;
    }

    // 1. Foundation Class Validations
    if (cls.isFoundationClass) {
      // Must have at least one multi-subject assignment
      const multiSubjAsn = clsAssignments.find(a => a.subjectId === "multi-subject");
      if (!multiSubjAsn) {
        diagnosticEngine.critical(MODULE, `Foundation class ${cls.className} is missing a multi-subject teacher allocation.`, { classId: cls.classId });
      } else {
        // Class teacher must equal the multi-subject teacher
        if (cls.classTeacherId && cls.classTeacherId !== multiSubjAsn.teacherId) {
          diagnosticEngine.critical(MODULE, `Foundation class ${cls.className} class teacher does not match its primary multi-subject teacher.`, { 
            classId: cls.classId,
            classTeacherId: cls.classTeacherId,
            multiSubjectTeacherId: multiSubjAsn.teacherId 
          });
        }
      }

      // Detect split allocations for core subjects (Foundation shouldn't have specialized core teachers)
      // Activity subjects like art, music, pe are fine.
      const activitySubjs = ["act-art", "act-music", "act-games", "act-library", "sub-pe"];
      for (const asn of clsAssignments) {
        if (asn.subjectId !== "multi-subject" && !activitySubjs.includes(asn.subjectId)) {
          diagnosticEngine.warn(MODULE, `Foundation class ${cls.className} has an unexpected specialized assignment: ${asn.subjectId}.`, { classId: cls.classId, subjectId: asn.subjectId });
        }
      }
    } 
    // 2. Specialized Class Validations (Grades 5-12)
    else {
      const assignedTeacherIds = new Set();
      const assignedSubjects = new Set();
      
      for (const asn of clsAssignments) {
        // No duplicate subject allocations for the same class
        if (assignedSubjects.has(asn.subjectId)) {
          diagnosticEngine.critical(MODULE, `Class ${cls.className} has duplicate assignments for subject: ${asn.subjectId}.`, { classId: cls.classId, subjectId: asn.subjectId });
        }
        assignedSubjects.add(asn.subjectId);
        assignedTeacherIds.add(asn.teacherId);
        
        // Ensure teacher doesn't have multi-subject violations (Specialized teachers should stick to their specialization)
        const teacher = teacherMap.get(asn.teacherId);
        if (teacher) {
          const specId = teacher.specializationSubjectId || teacher.metadata?.subjectId;
          // Activity teachers might not strictly match if they handle multiple activities, but for core subjects:
          if (specId && specId !== asn.subjectId && specId !== "multi-subject" && !specId.startsWith("act-")) {
             diagnosticEngine.warn(MODULE, `Teacher ${teacher.name} is teaching ${asn.subjectId} but their specialization is ${specId}.`, { teacherId: teacher.id, subjectId: asn.subjectId });
          }
        }
      }

      // Class teacher must teach at least one subject in that class
      if (cls.classTeacherId && !assignedTeacherIds.has(cls.classTeacherId)) {
        diagnosticEngine.critical(MODULE, `Class teacher for ${cls.className} does not teach any subject in this class.`, { classId: cls.classId, classTeacherId: cls.classTeacherId });
      }

      // 3. Stream Validations
      if (cls.streamId) {
        const stream = streamMap.get(cls.streamId);
        if (stream && stream.subjectIds) {
          for (const requiredSubj of stream.subjectIds) {
            if (!assignedSubjects.has(requiredSubj)) {
              diagnosticEngine.critical(MODULE, `Class ${cls.className} (${stream.name}) is missing mandatory stream subject: ${requiredSubj}.`, { classId: cls.classId, streamId: cls.streamId, missingSubject: requiredSubj });
            }
          }
        }
      }
    }
  }
};
