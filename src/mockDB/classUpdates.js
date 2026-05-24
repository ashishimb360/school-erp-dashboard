import { db } from "./entities";
import { getItem, setItem, removeItem } from "../persistence/storage";
import { STORAGE_KEYS } from "../persistence/storageKeys";

/**
 * generateClassUpdates
 *
 * Generates initial seed data for teacher class updates.
 */
const SCHEMA_VERSION = "v1";

export const generateClassUpdates = (db) => {
  const storedVersion = getItem("erp_class_updates_schema_version");
  if (storedVersion !== SCHEMA_VERSION) {
    removeItem(STORAGE_KEYS.CLASS_UPDATES);
    setItem("erp_class_updates_schema_version", SCHEMA_VERSION);
  }

  const persistedUpdates = getItem(STORAGE_KEYS.CLASS_UPDATES);
  if (persistedUpdates) {
    db.classUpdates = persistedUpdates;
    return;
  }

  // Seed initial class updates
  db.classUpdates = [
    {
      id: "upd_001",
      teacherId: "teach-001", // Dr. Sarah Wilson
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a", // Class XI - A (Science)
      className: "XI - A",
      subjectId: "sub-phy", // Physics
      subjectName: "Physics",
      title: "Homework Reminder: Ch 4 Numericals",
      message:
        "Please complete Chapter 4 numerical problems (1 to 10) in your notebooks. Notebook submission is on Thursday.",
      category: "HOMEWORK", // HOMEWORK | EXAM | REMINDER | MENTOR | CLASS_NOTICE | PARENT_MEETING
      visibility: ["STUDENT", "PARENT"], // ["STUDENT"], ["PARENT"], ["STUDENT", "PARENT"]
      createdAt: "2026-05-18T08:30:00Z",
      priority: "NORMAL", // LOW | NORMAL | IMPORTANT
    },
    {
      id: "upd_002",
      teacherId: "teach-001", // Dr. Sarah Wilson
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a",
      className: "XI - A",
      subjectId: "sub-chem",
      subjectName: "Chemistry",
      title: "Titration Practical Guidelines",
      message:
        "Tomorrow is the Chemistry practical session. All students must wear their lab aprons and bring their completed lab journals. Attendance is mandatory.",
      category: "REMINDER",
      visibility: ["STUDENT"],
      createdAt: "2026-05-19T09:15:00Z",
      priority: "IMPORTANT",
    },
    {
      id: "upd_003",
      teacherId: "teach-002", // Mrs. Priya Nair
      teacherName: "Mrs. Priya Nair",
      classId: "class-11b",
      className: "XI - B",
      subjectId: "sub-bio",
      subjectName: "Biology",
      title: "Special Academic Review Meeting",
      message:
        "Urgent individual progress review for Biology Unit assessments will be held this Saturday. Recommended for parents to discuss child study plan.",
      category: "PARENT_MEETING",
      visibility: ["PARENT"],
      createdAt: "2026-05-17T11:00:00Z",
      priority: "IMPORTANT",
    },
    {
      id: "upd_004",
      teacherId: "teach-001", // Dr. Sarah Wilson
      teacherName: "Dr. Sarah Wilson",
      classId: "class-11a",
      className: "XI - A",
      subjectId: "sub-phy",
      subjectName: "Physics",
      title: "Physics Revision Worksheets",
      message:
        "Physics unit revision worksheets for Kinematics are uploaded. Students should solve it by next Tuesday.",
      category: "CLASS_NOTICE",
      visibility: ["STUDENT", "PARENT"],
      createdAt: "2026-05-16T14:20:00Z",
      priority: "LOW",
    },
  ];

  setItem(STORAGE_KEYS.CLASS_UPDATES, db.classUpdates);
};
