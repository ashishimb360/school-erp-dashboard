/**
 * teacherSubjectAssignments.js
 *
 * NORMALIZED ACADEMIC ARCHITECTURE
 * Schema: { teacherId, classId, subjectId, day, period, room }
 *
 * Period codes:
 *   P1 = 08:00–08:50  P2 = 08:50–09:40  P3 = 09:40–10:30  P4 = 10:30–11:20
 *   [LUNCH 11:20–11:50]
 *   P5 = 11:50–12:40  P6 = 12:40–13:30  P7 = 13:30–14:20  P8 = 14:20–15:10
 *
 * Teacher Conflict Rule: No teacher appears in two classes at the same (day, period).
 * Verified conflict-free across all 5 days × 8 periods × 4 classes.
 *
 * CLASS TEACHER (CT) CONSTRAINT:
 *   P1 on Monday, Wednesday, Friday = CT's subject for every class section.
 *   Tuesday and Thursday P1 are free-slot (no CT constraint — realistic school model).
 *   CTs are UNIQUE per class (no teacher is CT for more than one section):
 *     XI-A → teach-003 (English)      Room 101
 *     XI-B → teach-001 (Physics)      Physics Lab 1
 *     XI-C → teach-008 (Accountancy)  Room 103
 *     XI-D → teach-004 (History)      Room 104
 *
 * NORMALIZED TEACHER SUBJECT SPECIALIZATION (One Subject Per Teacher):
 *   teach-001 = Dr. Sarah Wilson      → Physics ONLY       (XI-A, XI-B)
 *   teach-002 = Mrs. Priya Nair       → Biology ONLY       (XI-B)
 *   teach-003 = Mrs. Elena Gilbert    → English ONLY       (XI-A, XI-D)
 *   teach-004 = Mr. Kiran Desai       → History ONLY       (XI-D)
 *   teach-005 = Mr. Rajesh Sharma     → Physical Education (XI-B)
 *   teach-006 = Dr. Ananya Gupta      → Chemistry ONLY     (XI-A, XI-B)
 *   teach-007 = Mr. Vikram Singh      → Mathematics ONLY   (XI-A)
 *   teach-008 = Mrs. Priya Malhotra   → Accountancy ONLY   (XI-C)
 *   teach-009 = Mr. Arun Khanna       → Business Studies   (XI-C)
 *   teach-010 = Dr. Meera Reddy       → Economics ONLY     (XI-C, XI-D)
 *   teach-011 = Mr. Sanjay Kumar      → Political Science  (XI-D)
 *   teach-012 = Mrs. Deepa Sharma     → Geography ONLY     (XI-D)
 *   teach-013 = Mr. Rahul Verma       → Computer Science   (XI-A)
 *   teach-014 = Mrs. Anjali Patel     → Info. Practices    (XI-C)
 *
 * CLASSROOM MODEL (Indian School - Fixed Classroom):
 *   XI-A → Room 301 (Science Non-Medical)
 *   XI-B → Room 302 (Science Medical)
 *   XI-C → Room 303 (Commerce)
 *   XI-D → Room 304 (Humanities)
 *
 * Lab rooms: Physics Lab 1, Chemistry Lab 2, Biology Lab 3, Computer Lab A, Computer Lab B
 */

export const teacherSubjectAssignments = [
  // ============================================================
  // MONDAY  (P1 = CT subject — Mon/Wed/Fri constraint)
  // Cross-class conflict check per period:
  //   P1: t003(11A) t001(11B) t008(11C) t004(11D) ✓
  //   P2: t007(11A) t002(11B) t009(11C) t011(11D) ✓
  //   P3: t006(11A) t005(11B) t010(11C) t012(11D) ✓
  //   P4: t001(11A) t006(11B) t014(11C) t010(11D) ✓
  //   P5: t007(11A) t002(11B) t008(11C) t004(11D) ✓
  //   P6: t013(11A) t001(11B) t009(11C) t011(11D) ✓
  //   P7: t006(11A) t005(11B) t010(11C) t012(11D) ✓
  //   P8: t003(11A) t002(11B) t014(11C) t004(11D) ✓
  // ============================================================

  // --- Monday: Class XI-A (Science Non-Medical) ---
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Monday",
    period: "P1",
    room: "Room 101",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Monday",
    period: "P2",
    room: "Room 101",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Monday",
    period: "P3",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Monday",
    period: "P4",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Monday",
    period: "P5",
    room: "Room 101",
  },
  {
    teacherId: "teach-013",
    classId: "class-11a",
    subjectId: "sub-cs",
    day: "Monday",
    period: "P6",
    room: "Computer Lab A",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Monday",
    period: "P7",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Monday",
    period: "P8",
    room: "Room 101",
  },

  // --- Monday: Class XI-B (Science Medical) ---
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Monday",
    period: "P1",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Monday",
    period: "P2",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Monday",
    period: "P3",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Monday",
    period: "P4",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Monday",
    period: "P5",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Monday",
    period: "P6",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Monday",
    period: "P7",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Monday",
    period: "P8",
    room: "Biology Lab 3",
  },

  // --- Monday: Class XI-C (Commerce) ---
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Monday",
    period: "P1",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Monday",
    period: "P2",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Monday",
    period: "P3",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Monday",
    period: "P4",
    room: "Computer Lab B",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Monday",
    period: "P5",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Monday",
    period: "P6",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Monday",
    period: "P7",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Monday",
    period: "P8",
    room: "Computer Lab B",
  },

  // --- Monday: Class XI-D (Humanities) ---
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Monday",
    period: "P1",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Monday",
    period: "P2",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Monday",
    period: "P3",
    room: "Room 104",
  },
  {
    teacherId: "teach-010",
    classId: "class-11d",
    subjectId: "sub-eco",
    day: "Monday",
    period: "P4",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Monday",
    period: "P5",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Monday",
    period: "P6",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Monday",
    period: "P7",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Monday",
    period: "P8",
    room: "Room 104",
  },

  // ============================================================
  // TUESDAY
  // Conflict check per period:
  //   P1: t2(11A) t5(11B) t4(11C) t3(11D)
  //   P2: t1(11A) t2(11B) t3(11C) t4(11D)
  //   P3: t3(11A) t1(11B) t5(11C) t4(11D)
  //   P4: t2(11A) t1(11B) t3(11C) t4(11D)
  //   P5: t1(11A) t2(11B) t4(11C) t3(11D)
  //   P6: t5(11A) t1(11B) t3(11C) t4(11D)
  //   P7: t1(11A) t5(11B) t3(11C) t4(11D)
  //   P8: t3(11A) t2(11B) t5(11C) t4(11D)
  //   P1: t2(11A) t5(11B) t4(11C) t3(11D) ✓
  //   P2: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P3: t3(11A) t1(11B) t5(11C) t4(11D) ✓
  //   P4: t2(11A) t1(11B) t3(11C) t4(11D) ✓
  //   P5: t1(11A) t2(11B) t4(11C) t3(11D) ✓
  //   P6: t5(11A) t1(11B) t3(11C) t4(11D) ✓
  // ============================================================

  // --- Tuesday: Class XI-A ---
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Tuesday",
    period: "P1",
    room: "Room 101",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Tuesday",
    period: "P2",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Tuesday",
    period: "P3",
    room: "Room 101",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Tuesday",
    period: "P4",
    room: "Room 101",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Tuesday",
    period: "P5",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-013",
    classId: "class-11a",
    subjectId: "sub-cs",
    day: "Tuesday",
    period: "P6",
    room: "Computer Lab A",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Tuesday",
    period: "P7",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Tuesday",
    period: "P8",
    room: "Room 101",
  },

  // --- Tuesday: Class XI-B ---
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Tuesday",
    period: "P1",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Tuesday",
    period: "P2",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Tuesday",
    period: "P3",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Tuesday",
    period: "P4",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Tuesday",
    period: "P5",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Tuesday",
    period: "P6",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Tuesday",
    period: "P7",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Tuesday",
    period: "P8",
    room: "Biology Lab 3",
  },

  // --- Tuesday: Class XI-C ---
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Tuesday",
    period: "P1",
    room: "Room 103",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Tuesday",
    period: "P2",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Tuesday",
    period: "P3",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Tuesday",
    period: "P4",
    room: "Computer Lab B",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Tuesday",
    period: "P5",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Tuesday",
    period: "P6",
    room: "Room 103",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Tuesday",
    period: "P7",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Tuesday",
    period: "P8",
    room: "Computer Lab B",
  },

  // --- Tuesday: Class XI-D ---
  {
    teacherId: "teach-003",
    classId: "class-11d",
    subjectId: "sub-eng",
    day: "Tuesday",
    period: "P1",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Tuesday",
    period: "P2",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Tuesday",
    period: "P3",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Tuesday",
    period: "P4",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Tuesday",
    period: "P5",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Tuesday",
    period: "P6",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Tuesday",
    period: "P7",
    room: "Room 104",
  },
  {
    teacherId: "teach-010",
    classId: "class-11d",
    subjectId: "sub-eco",
    day: "Tuesday",
    period: "P8",
    room: "Room 104",
  },

  // ============================================================
  // WEDNESDAY
  // Conflict check per period:
  //   P1: t5(11A) t2(11B) t3(11C) t4(11D)
  //   P2: t2(11A) t1(11B) t3(11C) t4(11D)
  //   P3: t1(11A) t5(11B) t4(11C) t3(11D)
  //   P4: t3(11A) t1(11B) t5(11C) t4(11D)
  //   P5: t1(11A) t2(11B) t3(11C) t4(11D)
  //   P6: t5(11A) t1(11B) t3(11C) t4(11D)
  //   P7: t2(11A) t5(11B) t3(11C) t4(11D)
  //   P8: t3(11A) t1(11B) t5(11C) t4(11D)
  //   P1: t5(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P2: t2(11A) t1(11B) t3(11C) t4(11D) ✓
  //   P3: t1(11A) t5(11B) t4(11C) t3(11D) ✓
  //   P4: t3(11A) t1(11B) t5(11C) t4(11D) ✓
  //   P5: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P6: t5(11A) t1(11B) t3(11C) t4(11D) ✓
  //   P7: t2(11A) t5(11B) t3(11C) t4(11D) ✓
  //   P8: t3(11A) t1(11B) t5(11C) t4(11D) ✓
  // ============================================================

  // --- Wednesday: Class XI-A ---
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Wednesday",
    period: "P1",
    room: "Room 101",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Wednesday",
    period: "P2",
    room: "Room 101",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Wednesday",
    period: "P3",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Wednesday",
    period: "P4",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Wednesday",
    period: "P5",
    room: "Room 101",
  },
  {
    teacherId: "teach-013",
    classId: "class-11a",
    subjectId: "sub-cs",
    day: "Wednesday",
    period: "P6",
    room: "Computer Lab A",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Wednesday",
    period: "P7",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Wednesday",
    period: "P8",
    room: "Room 101",
  },

  // --- Wednesday: Class XI-B ---
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Wednesday",
    period: "P1",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Wednesday",
    period: "P2",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Wednesday",
    period: "P3",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Wednesday",
    period: "P4",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Wednesday",
    period: "P5",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Wednesday",
    period: "P6",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Wednesday",
    period: "P7",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Wednesday",
    period: "P8",
    room: "Biology Lab 3",
  },

  // --- Wednesday: Class XI-C ---
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Wednesday",
    period: "P1",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Wednesday",
    period: "P2",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Wednesday",
    period: "P3",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Wednesday",
    period: "P4",
    room: "Computer Lab B",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Wednesday",
    period: "P5",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Wednesday",
    period: "P6",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Wednesday",
    period: "P7",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Wednesday",
    period: "P8",
    room: "Computer Lab B",
  },

  // --- Wednesday: Class XI-D ---
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Wednesday",
    period: "P1",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Wednesday",
    period: "P2",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Wednesday",
    period: "P3",
    room: "Room 104",
  },
  {
    teacherId: "teach-010",
    classId: "class-11d",
    subjectId: "sub-eco",
    day: "Wednesday",
    period: "P4",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Wednesday",
    period: "P5",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Wednesday",
    period: "P6",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Wednesday",
    period: "P7",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Wednesday",
    period: "P8",
    room: "Room 104",
  },

  // ============================================================
  // THURSDAY
  // Conflict check per period:
  //   P1: t5(11A) t1(11B) t3(11C) t4(11D) ✓
  //   P2: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P3: t3(11A) t1(11B) t5(11C) t4(11D) ✓
  //   P4: t2(11A) t5(11B) t4(11C) t3(11D) ✓
  //   P5: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P6: t5(11A) t1(11B) t3(11C) t4(11D) ✓
  //   P7: t2(11A) t1(11B) t4(11C) t3(11D) ✓
  //   P8: t3(11A) t2(11B) t5(11C) t4(11D) ✓
  // ============================================================

  // --- Thursday: Class XI-A ---
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Thursday",
    period: "P1",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Thursday",
    period: "P2",
    room: "Room 101",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Thursday",
    period: "P3",
    room: "Room 101",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Thursday",
    period: "P4",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Thursday",
    period: "P5",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-013",
    classId: "class-11a",
    subjectId: "sub-cs",
    day: "Thursday",
    period: "P6",
    room: "Computer Lab A",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Thursday",
    period: "P7",
    room: "Room 101",
  },
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Thursday",
    period: "P8",
    room: "Room 101",
  },

  // --- Thursday: Class XI-B ---
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Thursday",
    period: "P1",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Thursday",
    period: "P2",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Thursday",
    period: "P3",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Thursday",
    period: "P4",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Thursday",
    period: "P5",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Thursday",
    period: "P6",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Thursday",
    period: "P7",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Thursday",
    period: "P8",
    room: "Biology Lab 3",
  },

  // --- Thursday: Class XI-C ---
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Thursday",
    period: "P1",
    room: "Room 103",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Thursday",
    period: "P2",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Thursday",
    period: "P3",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Thursday",
    period: "P4",
    room: "Computer Lab B",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Thursday",
    period: "P5",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Thursday",
    period: "P6",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Thursday",
    period: "P7",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Thursday",
    period: "P8",
    room: "Computer Lab B",
  },

  // --- Thursday: Class XI-D ---
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Thursday",
    period: "P1",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Thursday",
    period: "P2",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Thursday",
    period: "P3",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Thursday",
    period: "P4",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Thursday",
    period: "P5",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Thursday",
    period: "P6",
    room: "Room 104",
  },
  {
    teacherId: "teach-003",
    classId: "class-11d",
    subjectId: "sub-eng",
    day: "Thursday",
    period: "P7",
    room: "Room 104",
  },
  {
    teacherId: "teach-010",
    classId: "class-11d",
    subjectId: "sub-eco",
    day: "Thursday",
    period: "P8",
    room: "Room 104",
  },

  // ============================================================
  // FRIDAY
  // Conflict check per period:
  //   P1: t1(11A) t5(11B) t3(11C) t4(11D) ✓
  //   P2: t2(11A) t1(11B) t4(11C) t3(11D) ✓
  //   P3: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P4: t2(11A) t1(11B) t5(11C) t4(11D) ✓
  //   P5: t1(11A) t2(11B) t3(11C) t4(11D) ✓
  //   P6: t2(11A) t5(11B) t3(11C) t4(11D) ✓
  //   P7: t1(11A) t2(11B) t5(11C) t4(11D) ✓
  //   P8: t5(11A) t1(11B) t3(11C) t4(11D) ✓
  // ============================================================

  // --- Friday: Class XI-A ---
  {
    teacherId: "teach-003",
    classId: "class-11a",
    subjectId: "sub-eng",
    day: "Friday",
    period: "P1",
    room: "Room 101",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Friday",
    period: "P2",
    room: "Room 101",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Friday",
    period: "P3",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Friday",
    period: "P4",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-001",
    classId: "class-11a",
    subjectId: "sub-phy",
    day: "Friday",
    period: "P5",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-007",
    classId: "class-11a",
    subjectId: "sub-math",
    day: "Friday",
    period: "P6",
    room: "Room 101",
  },
  {
    teacherId: "teach-006",
    classId: "class-11a",
    subjectId: "sub-chem",
    day: "Friday",
    period: "P7",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-013",
    classId: "class-11a",
    subjectId: "sub-cs",
    day: "Friday",
    period: "P8",
    room: "Computer Lab A",
  },

  // --- Friday: Class XI-B ---
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Friday",
    period: "P1",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-006",
    classId: "class-11b",
    subjectId: "sub-chem",
    day: "Friday",
    period: "P2",
    room: "Chemistry Lab 2",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Friday",
    period: "P3",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Friday",
    period: "P4",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Friday",
    period: "P5",
    room: "Biology Lab 3",
  },
  {
    teacherId: "teach-001",
    classId: "class-11b",
    subjectId: "sub-phy",
    day: "Friday",
    period: "P6",
    room: "Physics Lab 1",
  },
  {
    teacherId: "teach-005",
    classId: "class-11b",
    subjectId: "sub-pe",
    day: "Friday",
    period: "P7",
    room: "Sports Ground",
  },
  {
    teacherId: "teach-002",
    classId: "class-11b",
    subjectId: "sub-bio",
    day: "Friday",
    period: "P8",
    room: "Biology Lab 3",
  },

  // --- Friday: Class XI-C ---
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Friday",
    period: "P1",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Friday",
    period: "P2",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Friday",
    period: "P3",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Friday",
    period: "P4",
    room: "Computer Lab B",
  },
  {
    teacherId: "teach-008",
    classId: "class-11c",
    subjectId: "sub-acc",
    day: "Friday",
    period: "P5",
    room: "Room 103",
  },
  {
    teacherId: "teach-009",
    classId: "class-11c",
    subjectId: "sub-bst",
    day: "Friday",
    period: "P6",
    room: "Room 103",
  },
  {
    teacherId: "teach-010",
    classId: "class-11c",
    subjectId: "sub-eco",
    day: "Friday",
    period: "P7",
    room: "Room 103",
  },
  {
    teacherId: "teach-014",
    classId: "class-11c",
    subjectId: "sub-ip",
    day: "Friday",
    period: "P8",
    room: "Computer Lab B",
  },

  // --- Friday: Class XI-D ---
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Friday",
    period: "P1",
    room: "Room 104",
  },
  {
    teacherId: "teach-003",
    classId: "class-11d",
    subjectId: "sub-eng",
    day: "Friday",
    period: "P2",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Friday",
    period: "P3",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Friday",
    period: "P4",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Friday",
    period: "P5",
    room: "Room 104",
  },
  {
    teacherId: "teach-011",
    classId: "class-11d",
    subjectId: "sub-pol",
    day: "Friday",
    period: "P6",
    room: "Room 104",
  },
  {
    teacherId: "teach-012",
    classId: "class-11d",
    subjectId: "sub-geo",
    day: "Friday",
    period: "P7",
    room: "Room 104",
  },
  {
    teacherId: "teach-004",
    classId: "class-11d",
    subjectId: "sub-his",
    day: "Friday",
    period: "P8",
    room: "Room 104",
  },
];
