/**
 * src/initialization/validators/staffingValidator.js
 * 
 * Validates staffing realism, calculates workloads, and prevents
 * unrealistic school-wide bottlenecks.
 */

import { diagnosticEngine } from "./diagnosticEngine";

// Configurable thresholds
const MAX_SECTIONS_PER_TEACHER = 8;
const MIN_SECTIONS_PER_TEACHER = 1;
const CRITICAL_SHORTAGE_THRESHOLD = 1;

export const validateStaffingAndWorkload = (teachers, assignments, classes) => {
  const MODULE = "StaffingValidator";
  
  // 1. Calculate Teacher Workload
  const workloadMap = new Map();
  teachers.forEach(t => workloadMap.set(t.id, {
    teacher: t,
    sectionsAssigned: new Set(),
    classesAssigned: new Set(),
    subjectsAssigned: new Set()
  }));

  const subjectDemand = new Map(); // Subject -> Set of classes that need it
  const subjectSupply = new Map(); // Subject -> Set of teachers who teach it

  // Process Assignments
  for (const asn of assignments) {
    if (!subjectDemand.has(asn.subjectId)) subjectDemand.set(asn.subjectId, new Set());
    subjectDemand.get(asn.subjectId).add(asn.classId);

    const workload = workloadMap.get(asn.teacherId);
    if (workload) {
      workload.classesAssigned.add(asn.classId);
      workload.subjectsAssigned.add(asn.subjectId);
      const section = asn.classId.slice(-1).toUpperCase();
      workload.sectionsAssigned.add(section);
      
      if (!subjectSupply.has(asn.subjectId)) subjectSupply.set(asn.subjectId, new Set());
      subjectSupply.get(asn.subjectId).add(asn.teacherId);
    }
  }

  // 2. Validate Individual Workloads
  for (const [teacherId, wl] of workloadMap) {
    const totalClasses = wl.classesAssigned.size;
    
    if (totalClasses > MAX_SECTIONS_PER_TEACHER) {
      diagnosticEngine.warn(MODULE, `Teacher ${wl.teacher.name} is overloaded (${totalClasses} classes assigned). Max recommended is ${MAX_SECTIONS_PER_TEACHER}.`, { teacherId, totalClasses });
    }
    
    if (totalClasses === 0) {
      diagnosticEngine.info(MODULE, `Teacher ${wl.teacher.name} is completely unassigned (underutilized).`, { teacherId });
    } else if (totalClasses < MIN_SECTIONS_PER_TEACHER && wl.teacher.teacherType !== "ACTIVITY") {
      diagnosticEngine.info(MODULE, `Teacher ${wl.teacher.name} is underutilized (${totalClasses} classes assigned).`, { teacherId, totalClasses });
    }
  }

  // 3. Validate Institutional Staffing Distribution
  for (const [subjectId, classesSet] of subjectDemand) {
    // Activity subjects are often handled by 1 teacher for the whole school, so skip them for critical shortage
    if (subjectId.startsWith("act-") || subjectId === "sub-pe") continue;

    const teachersSupplying = subjectSupply.get(subjectId) || new Set();
    const demandCount = classesSet.size;
    const supplyCount = teachersSupplying.size;

    // E.g., if English is needed in 30 classes but there's only 1 English teacher
    if (demandCount > 0 && supplyCount === 0) {
      diagnosticEngine.critical(MODULE, `No teacher available for subject: ${subjectId} (Required by ${demandCount} classes).`, { subjectId, demandCount });
    } else if (demandCount > MAX_SECTIONS_PER_TEACHER * CRITICAL_SHORTAGE_THRESHOLD && supplyCount === CRITICAL_SHORTAGE_THRESHOLD) {
      // If 1 teacher is handling way too many classes for a core subject
      diagnosticEngine.warn(MODULE, `Critical institutional dependency: Only ${supplyCount} teacher(s) supplying ${subjectId} across ${demandCount} classes. Expect severe overload.`, { subjectId, demandCount, supplyCount });
    }
  }
};
