import { db } from "./entities";
import { getItem, setItem, removeItem } from "../persistence/storage";
import { STORAGE_KEYS } from "../persistence/storageKeys";

/**
 * generateLeaveRequests
 *
 * Generates initial seed data for student leave requests.
 */
const LEAVE_SCHEMA_VERSION = "v2"; // Schema version

export const generateLeaveRequests = (db) => {
  const storedVersion = getItem(STORAGE_KEYS.LEAVE_SCHEMA_VERSION);
  if (storedVersion !== LEAVE_SCHEMA_VERSION) {
    removeItem(STORAGE_KEYS.LEAVE_REQUESTS);
    setItem(STORAGE_KEYS.LEAVE_SCHEMA_VERSION, LEAVE_SCHEMA_VERSION);
  }

  const persistedLeaves = getItem(STORAGE_KEYS.LEAVE_REQUESTS);
  if (persistedLeaves) {
    db.leaveRequests = persistedLeaves;
    return;
  }

  // Seed initial leave requests
  db.leaveRequests = [
    {
      id: "leave_001",
      studentId: "stud-001", // Rohan Kumar
      classId: "class-11a",
      appliedTo: "teach-001", // Dr. Sarah Wilson
      reason: "High fever and doctor-prescribed medical rest",
      fromDate: "2026-05-20",
      toDate: "2026-05-22",
      appliedAt: "2026-05-18T09:15:00Z",
      status: "PENDING", // PENDING | APPROVED | REJECTED
      reviewedAt: null,
      reviewedBy: null,
      teacherComment: "",
    },
    {
      id: "leave_002",
      studentId: "stud-002", // Priya Sharma
      classId: "class-11b",
      appliedTo: "teach-002", // Mrs. Priya Nair
      reason: "Sister's marriage out of station",
      fromDate: "2026-05-15",
      toDate: "2026-05-16",
      appliedAt: "2026-05-12T14:30:00Z",
      status: "APPROVED",
      reviewedAt: "2026-05-13T10:00:00Z",
      reviewedBy: "teach-002",
      teacherComment:
        "Approved. Please complete the assignments by next Monday.",
    },
    {
      id: "leave_003",
      studentId: "stud-003", // Rahul Verma
      classId: "class-11a",
      appliedTo: "teach-001", // Dr. Sarah Wilson
      reason: "Dental checkup and wisdom tooth extraction",
      fromDate: "2026-05-25",
      toDate: "2026-05-25",
      appliedAt: "2026-05-18T11:00:00Z",
      status: "REJECTED",
      reviewedAt: "2026-05-18T15:30:00Z",
      reviewedBy: "teach-001",
      teacherComment:
        "Cannot grant leave during Unit Test week. Please reschedule the appointment if possible.",
    },
  ];

  setItem(STORAGE_KEYS.LEAVE_REQUESTS, db.leaveRequests);
};
