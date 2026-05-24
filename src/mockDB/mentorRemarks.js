import { db } from "./entities";
import { getItem, setItem, removeItem } from "../persistence/storage";
import { STORAGE_KEYS } from "../persistence/storageKeys";

/**
 * generateMentorRemarks
 *
 * Generates initial seed data for student mentorship and guidance logs.
 */
const REMARKS_SCHEMA_VERSION = "v2";

export const generateMentorRemarks = (db) => {
  const storedVersion = getItem(STORAGE_KEYS.REMARKS_SCHEMA_VERSION);
  if (storedVersion !== REMARKS_SCHEMA_VERSION) {
    removeItem(STORAGE_KEYS.MENTOR_REMARKS);
    setItem(STORAGE_KEYS.REMARKS_SCHEMA_VERSION, REMARKS_SCHEMA_VERSION);
  }

  const persistedRemarks = getItem(STORAGE_KEYS.MENTOR_REMARKS);
  if (persistedRemarks) {
    db.mentorRemarks = persistedRemarks;
    return;
  }

  // Seed initial high-fidelity mentor remarks
  db.mentorRemarks = [
    {
      id: "rem_001",
      studentId: "stud-001", // Rohan Kumar
      studentName: "Rohan Kumar",
      teacherId: "teach-001", // Dr. Sarah Wilson
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a", // Class XI-A
      category: "ACADEMIC", // ACADEMIC | ATTENDANCE | BEHAVIOR | PARENT_MEETING | COUNSELING | POSITIVE_FEEDBACK
      title: "Improvement in Physics Assignments",
      note: "Rohan has shown excellent consistency in submitting his recent physics workbook sheets on time. Keep it up!",
      visibility: "PARENT_VISIBLE", // INTERNAL | PARENT_VISIBLE
      priority: "NORMAL", // LOW | NORMAL | IMPORTANT
      createdAt: "2026-05-10T10:15:00Z",
      followUpRequired: false,
      followUpResolved: false,
      tags: ["Physics", "Assignments", "Improvement"],
    },
    {
      id: "rem_002",
      studentId: "stud-002", // Priya Sharma
      studentName: "Priya Sharma",
      teacherId: "teach-002", // Mrs. Priya Nair
      teacherName: "Mrs. Priya Nair",
      classId: "class-11b",
      category: "PARENT_MEETING",
      title: "Biology Career Discussion",
      note: "Met with Priya's mother to discuss progress. Highlighted her exceptional grasp of genetic molecular structures. Recommended medical preparation tracks.",
      visibility: "PARENT_VISIBLE",
      priority: "NORMAL",
      createdAt: "2026-05-14T11:30:00Z",
      followUpRequired: false,
      followUpResolved: false,
      tags: ["Biology", "Career", "Parent-Consult"],
    },
    {
      id: "rem_003",
      studentId: "stud-001", // Rohan Kumar
      studentName: "Rohan Kumar",
      teacherId: "teach-001",
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a",
      category: "ATTENDANCE",
      title: "Consecutive Morning Absences",
      note: "Rohan missed morning homeroom sessions three days this week. Internal monitoring initiated. Need to call parents to discuss punctuality.",
      visibility: "INTERNAL",
      priority: "IMPORTANT",
      createdAt: "2026-05-18T09:00:00Z",
      followUpRequired: true,
      followUpResolved: false,
      tags: ["Attendance", "Punctuality", "Warning"],
    },
    {
      id: "rem_004",
      studentId: "stud-001", // Rohan Kumar
      studentName: "Rohan Kumar",
      teacherId: "teach-001",
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a",
      category: "POSITIVE_FEEDBACK",
      title: "Science Quiz Leadership",
      note: "Volunteered to lead the group demonstration for electrical resistance circuits. Showed clear communication and peer mentoring skills.",
      visibility: "PARENT_VISIBLE",
      priority: "LOW",
      createdAt: "2026-05-19T08:45:00Z",
      followUpRequired: false,
      followUpResolved: false,
      tags: ["Leadership", "Physics", "Active Participation"],
    },
  ];

  setItem(STORAGE_KEYS.MENTOR_REMARKS, db.mentorRemarks);
};
