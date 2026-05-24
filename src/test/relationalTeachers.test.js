import { describe, it, expect, beforeEach } from "vitest";
import { generateExpandedTeachers } from "../mockDB/seed/expandedTeachers";
import {
  generateTeacherSubjectAssignments,
  deriveClassTeacherMap,
} from "../mockDB/seed/teacherSubjectAssignments";
import localProvider from "../data/providers/localProvider";
import { initializeSeeds } from "../initialization/initializeSeeds";
import { STORAGE_KEYS } from "../persistence/storageKeys";

describe("Relational Teacher-Class Refactor Verification", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Step 1 — Teacher Generation Schema", () => {
    it("should generate all teachers with strict relational schema (no positional runtime homerooms)", () => {
      const teachers = generateExpandedTeachers();
      expect(teachers.length).toBeGreaterThan(0);

      const TOP_LEVEL_KEYS = new Set([
        "id",
        "teacherType",
        "specializationSubjectId",
        "assignedLevels",
        "assignedSections",
        "eligibleStages",
        "metadata",
      ]);

      for (const teacher of teachers) {
        // Assert top-level keys conform strictly to standard structure
        Object.keys(teacher).forEach((key) => {
          expect(TOP_LEVEL_KEYS.has(key)).toBe(true);
        });

        // Ensure critical top-level properties exist
        expect(teacher.id).toBeDefined();
        expect(teacher.teacherType).toBeDefined();
        expect(teacher.specializationSubjectId).toBeDefined();
        expect(Array.isArray(teacher.assignedLevels)).toBe(true);
        expect(Array.isArray(teacher.assignedSections)).toBe(true);

        // Ensure all legacy/profile attributes are nested inside metadata
        expect(teacher.metadata).toBeDefined();
        expect(typeof teacher.metadata).toBe("object");
        expect(teacher.metadata.name).toBeDefined();
        expect(teacher.metadata.email).toBeDefined();
        expect(teacher.metadata.employeeId).toBeDefined();

        // Ensure absolutely no legacy flat homeroom properties at the top-level
        expect(teacher.homeroom).toBeUndefined();
      }
    });
  });

  describe("Step 2 & 3 — Relational Assignment & Priority Derivation", () => {
    it("should generate assignments and derive class-teacher mappings correctly", () => {
      const { getClassesSeed } = require("../mockDB/seed/classes");
      const { subjectsSeed } = require("../mockDB/seed/subjects");

      const teachers = generateExpandedTeachers();
      const classes = getClassesSeed();
      const assignments = generateTeacherSubjectAssignments(classes, teachers, subjectsSeed);

      expect(assignments.length).toBeGreaterThan(0);

      // Verify that every assignment has teacherId, classId, and subjectId
      for (const asn of assignments) {
        expect(asn.teacherId).toBeDefined();
        expect(asn.classId).toBeDefined();
        expect(asn.subjectId).toBeDefined();
      }

      // Resolve class teacher map
      const classTeacherMap = deriveClassTeacherMap(assignments);
      expect(classTeacherMap.size).toBeGreaterThan(0);

      // Check specialized priority cases
      // Foundation stage classes should get their multi-subject teacher
      const nurseryATeacherId = classTeacherMap.get("class-nurserya");
      expect(nurseryATeacherId).toBeDefined();
      const nurseryTeacher = teachers.find((t) => t.id === nurseryATeacherId);
      expect(nurseryTeacher.specializationSubjectId).toBe("multi-subject");

      // For a secondary/senior class that has English (sub-eng), that teacher should be preferred
      const class11aTeacherId = classTeacherMap.get("class-11a");
      expect(class11aTeacherId).toBeDefined();
      const teacher11a = teachers.find((t) => t.id === class11aTeacherId);
      // Wait, let's verify priority. Class 11A candidates have Mrs. Elena Gilbert (teach-003, English)
      // and others. Elena Gilbert teaches English (sub-eng). She should win!
      expect(teacher11a.specializationSubjectId).toBe("sub-eng");
    });
  });

  describe("Data Provider Transparent Backward-Compatibility Layer", () => {
    it("should transparently flatten and write teacher objects under the new schema", async () => {
      // Force database seed so teachers are loaded in localStorage under the relational metadata format
      initializeSeeds.checkAndSeed(true);

      const flatTeachers = await localProvider.getTeachers();
      expect(flatTeachers.length).toBeGreaterThan(0);

      // Verify that getTeachers returns fully-flattened profiles for backwards compatibility
      for (const flatTeacher of flatTeachers) {
        expect(flatTeacher.name).toBeDefined();
        expect(flatTeacher.email).toBeDefined();
        expect(flatTeacher.employeeId).toBeDefined();
        expect(flatTeacher.metadata).toBeDefined(); // still contains raw metadata
      }

      const firstId = flatTeachers[0].id;
      const flatSingleTeacher = await localProvider.getTeacherById(firstId);
      expect(flatSingleTeacher).toBeDefined();
      expect(flatSingleTeacher.name).toBe(flatTeachers[0].name);

      // Verify updating works transparently
      const originalName = flatSingleTeacher.name;
      const updatedTeacher = await localProvider.updateTeacher(firstId, {
        name: "Dr. Upgraded Name",
        experience: "25 Years",
        specializationSubjectId: "sub-phy",
      });

      // Verify the returned updated object is flat
      expect(updatedTeacher.name).toBe("Dr. Upgraded Name");
      expect(updatedTeacher.experience).toBe("25 Years");
      expect(updatedTeacher.specializationSubjectId).toBe("sub-phy");

      // Verify storage is pure: fetch raw array from localStorage and verify
      const rawTeachersFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS));
      const rawTeacher = rawTeachersFromStorage.find((t) => t.id === firstId);

      // Purity Check: Legacy keys like name/experience must NEVER be stored at top level
      expect(rawTeacher.name).toBeUndefined();
      expect(rawTeacher.experience).toBeUndefined();

      // Top level key must be correctly updated
      expect(rawTeacher.specializationSubjectId).toBe("sub-phy");

      // Nest keys must be correctly updated inside metadata
      expect(rawTeacher.metadata.name).toBe("Dr. Upgraded Name");
      expect(rawTeacher.metadata.experience).toBe("25 Years");
      expect(rawTeacher.metadata.subjectId).toBe("sub-phy");
    });
  });
});
