/**
 * scripts/fixTimetableSeed.js
 * One-time repair: replaces the Tuesday–Friday block in the static timetable seed
 * with a verified conflict-free, CT-in-P1 (Mon/Wed/Fri) schedule.
 * Run with: node scripts/fixTimetableSeed.js
 * Safe to delete after running.
 */
const fs = require("fs");
const path = require("path");

const TARGET = path.resolve(
  __dirname,
  "../src/mockDB/teacherSubjectAssignments.js",
);

const MARKER = "// TUESDAY";

const NEW_TUE_FRI = `  // ============================================================
  // TUESDAY  (no P1 CT constraint — free-slot day)
  // Cross-class conflict check per period:
  //   P1: t007(11A) t002(11B) t010(11C) t003(11D) ✓
  //   P2: t001(11A) t005(11B) t008(11C) t004(11D) ✓
  //   P3: t003(11A) t006(11B) t009(11C) t011(11D) ✓
  //   P4: t007(11A) t001(11B) t014(11C) t012(11D) ✓
  //   P5: t001(11A) t002(11B) t010(11C) t004(11D) ✓
  //   P6: t013(11A) t006(11B) t009(11C) t011(11D) ✓
  //   P7: t006(11A) t005(11B) t008(11C) t012(11D) ✓
  //   P8: t003(11A) t002(11B) t014(11C) t010(11D) ✓
  // ============================================================

  // --- Tuesday: Class XI-A ---
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Tuesday", period: "P1", room: "Room 101" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Tuesday", period: "P2", room: "Physics Lab 1" },
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Tuesday", period: "P3", room: "Room 101" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Tuesday", period: "P4", room: "Room 101" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Tuesday", period: "P5", room: "Physics Lab 1" },
  { teacherId: "teach-013", classId: "class-11a", subjectId: "sub-cs",   day: "Tuesday", period: "P6", room: "Computer Lab A" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Tuesday", period: "P7", room: "Chemistry Lab 2" },
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Tuesday", period: "P8", room: "Room 101" },

  // --- Tuesday: Class XI-B ---
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Tuesday", period: "P1", room: "Biology Lab 3" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Tuesday", period: "P2", room: "Sports Ground" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Tuesday", period: "P3", room: "Chemistry Lab 2" },
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Tuesday", period: "P4", room: "Physics Lab 1" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Tuesday", period: "P5", room: "Biology Lab 3" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Tuesday", period: "P6", room: "Chemistry Lab 2" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Tuesday", period: "P7", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Tuesday", period: "P8", room: "Biology Lab 3" },

  // --- Tuesday: Class XI-C ---
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Tuesday", period: "P1", room: "Room 103" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Tuesday", period: "P2", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Tuesday", period: "P3", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Tuesday", period: "P4", room: "Computer Lab B" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Tuesday", period: "P5", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Tuesday", period: "P6", room: "Room 103" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Tuesday", period: "P7", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Tuesday", period: "P8", room: "Computer Lab B" },

  // --- Tuesday: Class XI-D ---
  { teacherId: "teach-003", classId: "class-11d", subjectId: "sub-eng", day: "Tuesday", period: "P1", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Tuesday", period: "P2", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Tuesday", period: "P3", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Tuesday", period: "P4", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Tuesday", period: "P5", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Tuesday", period: "P6", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Tuesday", period: "P7", room: "Room 104" },
  { teacherId: "teach-010", classId: "class-11d", subjectId: "sub-eco", day: "Tuesday", period: "P8", room: "Room 104" },

  // ============================================================
  // WEDNESDAY  (P1 = CT subject — Mon/Wed/Fri constraint)
  // Cross-class conflict check per period:
  //   P1: t003(11A) t001(11B) t008(11C) t004(11D) ✓
  //   P2: t007(11A) t002(11B) t009(11C) t011(11D) ✓
  //   P3: t001(11A) t006(11B) t010(11C) t012(11D) ✓
  //   P4: t006(11A) t005(11B) t014(11C) t010(11D) ✓
  //   P5: t007(11A) t002(11B) t008(11C) t004(11D) ✓
  //   P6: t013(11A) t001(11B) t009(11C) t011(11D) ✓
  //   P7: t006(11A) t005(11B) t010(11C) t012(11D) ✓
  //   P8: t003(11A) t002(11B) t014(11C) t004(11D) ✓
  // ============================================================

  // --- Wednesday: Class XI-A ---
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Wednesday", period: "P1", room: "Room 101" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Wednesday", period: "P2", room: "Room 101" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Wednesday", period: "P3", room: "Physics Lab 1" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Wednesday", period: "P4", room: "Chemistry Lab 2" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Wednesday", period: "P5", room: "Room 101" },
  { teacherId: "teach-013", classId: "class-11a", subjectId: "sub-cs",   day: "Wednesday", period: "P6", room: "Computer Lab A" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Wednesday", period: "P7", room: "Chemistry Lab 2" },
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Wednesday", period: "P8", room: "Room 101" },

  // --- Wednesday: Class XI-B ---
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Wednesday", period: "P1", room: "Physics Lab 1" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Wednesday", period: "P2", room: "Biology Lab 3" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Wednesday", period: "P3", room: "Chemistry Lab 2" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Wednesday", period: "P4", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Wednesday", period: "P5", room: "Biology Lab 3" },
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Wednesday", period: "P6", room: "Physics Lab 1" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Wednesday", period: "P7", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Wednesday", period: "P8", room: "Biology Lab 3" },

  // --- Wednesday: Class XI-C ---
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Wednesday", period: "P1", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Wednesday", period: "P2", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Wednesday", period: "P3", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Wednesday", period: "P4", room: "Computer Lab B" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Wednesday", period: "P5", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Wednesday", period: "P6", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Wednesday", period: "P7", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Wednesday", period: "P8", room: "Computer Lab B" },

  // --- Wednesday: Class XI-D ---
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Wednesday", period: "P1", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Wednesday", period: "P2", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Wednesday", period: "P3", room: "Room 104" },
  { teacherId: "teach-010", classId: "class-11d", subjectId: "sub-eco", day: "Wednesday", period: "P4", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Wednesday", period: "P5", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Wednesday", period: "P6", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Wednesday", period: "P7", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Wednesday", period: "P8", room: "Room 104" },

  // ============================================================
  // THURSDAY  (no P1 CT constraint — free-slot day)
  // Cross-class conflict check per period:
  //   P1: t001(11A) t002(11B) t009(11C) t011(11D) ✓
  //   P2: t007(11A) t001(11B) t008(11C) t012(11D) ✓
  //   P3: t003(11A) t006(11B) t010(11C) t004(11D) ✓
  //   P4: t006(11A) t005(11B) t014(11C) t011(11D) ✓
  //   P5: t001(11A) t002(11B) t008(11C) t012(11D) ✓
  //   P6: t013(11A) t006(11B) t009(11C) t004(11D) ✓
  //   P7: t007(11A) t001(11B) t010(11C) t003(11D) ✓
  //   P8: t003(11A) t002(11B) t014(11C) t010(11D) ✓
  // ============================================================

  // --- Thursday: Class XI-A ---
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Thursday", period: "P1", room: "Physics Lab 1" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Thursday", period: "P2", room: "Room 101" },
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Thursday", period: "P3", room: "Room 101" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Thursday", period: "P4", room: "Chemistry Lab 2" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Thursday", period: "P5", room: "Physics Lab 1" },
  { teacherId: "teach-013", classId: "class-11a", subjectId: "sub-cs",   day: "Thursday", period: "P6", room: "Computer Lab A" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Thursday", period: "P7", room: "Room 101" },
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Thursday", period: "P8", room: "Room 101" },

  // --- Thursday: Class XI-B ---
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Thursday", period: "P1", room: "Biology Lab 3" },
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Thursday", period: "P2", room: "Physics Lab 1" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Thursday", period: "P3", room: "Chemistry Lab 2" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Thursday", period: "P4", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Thursday", period: "P5", room: "Biology Lab 3" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Thursday", period: "P6", room: "Chemistry Lab 2" },
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Thursday", period: "P7", room: "Physics Lab 1" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Thursday", period: "P8", room: "Biology Lab 3" },

  // --- Thursday: Class XI-C ---
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Thursday", period: "P1", room: "Room 103" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Thursday", period: "P2", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Thursday", period: "P3", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Thursday", period: "P4", room: "Computer Lab B" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Thursday", period: "P5", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Thursday", period: "P6", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Thursday", period: "P7", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Thursday", period: "P8", room: "Computer Lab B" },

  // --- Thursday: Class XI-D ---
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Thursday", period: "P1", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Thursday", period: "P2", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Thursday", period: "P3", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Thursday", period: "P4", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Thursday", period: "P5", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Thursday", period: "P6", room: "Room 104" },
  { teacherId: "teach-003", classId: "class-11d", subjectId: "sub-eng", day: "Thursday", period: "P7", room: "Room 104" },
  { teacherId: "teach-010", classId: "class-11d", subjectId: "sub-eco", day: "Thursday", period: "P8", room: "Room 104" },

  // ============================================================
  // FRIDAY  (P1 = CT subject — Mon/Wed/Fri constraint)
  // Cross-class conflict check per period:
  //   P1: t003(11A) t001(11B) t008(11C) t004(11D) ✓
  //   P2: t007(11A) t006(11B) t010(11C) t003(11D) ✓
  //   P3: t001(11A) t002(11B) t009(11C) t011(11D) ✓
  //   P4: t006(11A) t005(11B) t014(11C) t012(11D) ✓
  //   P5: t001(11A) t002(11B) t008(11C) t004(11D) ✓
  //   P6: t007(11A) t001(11B) t009(11C) t011(11D) ✓
  //   P7: t006(11A) t005(11B) t010(11C) t012(11D) ✓
  //   P8: t013(11A) t002(11B) t014(11C) t004(11D) ✓
  // ============================================================

  // --- Friday: Class XI-A ---
  { teacherId: "teach-003", classId: "class-11a", subjectId: "sub-eng",  day: "Friday", period: "P1", room: "Room 101" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Friday", period: "P2", room: "Room 101" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Friday", period: "P3", room: "Physics Lab 1" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Friday", period: "P4", room: "Chemistry Lab 2" },
  { teacherId: "teach-001", classId: "class-11a", subjectId: "sub-phy",  day: "Friday", period: "P5", room: "Physics Lab 1" },
  { teacherId: "teach-007", classId: "class-11a", subjectId: "sub-math", day: "Friday", period: "P6", room: "Room 101" },
  { teacherId: "teach-006", classId: "class-11a", subjectId: "sub-chem", day: "Friday", period: "P7", room: "Chemistry Lab 2" },
  { teacherId: "teach-013", classId: "class-11a", subjectId: "sub-cs",   day: "Friday", period: "P8", room: "Computer Lab A" },

  // --- Friday: Class XI-B ---
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Friday", period: "P1", room: "Physics Lab 1" },
  { teacherId: "teach-006", classId: "class-11b", subjectId: "sub-chem", day: "Friday", period: "P2", room: "Chemistry Lab 2" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Friday", period: "P3", room: "Biology Lab 3" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Friday", period: "P4", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Friday", period: "P5", room: "Biology Lab 3" },
  { teacherId: "teach-001", classId: "class-11b", subjectId: "sub-phy",  day: "Friday", period: "P6", room: "Physics Lab 1" },
  { teacherId: "teach-005", classId: "class-11b", subjectId: "sub-pe",   day: "Friday", period: "P7", room: "Sports Ground" },
  { teacherId: "teach-002", classId: "class-11b", subjectId: "sub-bio",  day: "Friday", period: "P8", room: "Biology Lab 3" },

  // --- Friday: Class XI-C ---
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Friday", period: "P1", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Friday", period: "P2", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Friday", period: "P3", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Friday", period: "P4", room: "Computer Lab B" },
  { teacherId: "teach-008", classId: "class-11c", subjectId: "sub-acc", day: "Friday", period: "P5", room: "Room 103" },
  { teacherId: "teach-009", classId: "class-11c", subjectId: "sub-bst", day: "Friday", period: "P6", room: "Room 103" },
  { teacherId: "teach-010", classId: "class-11c", subjectId: "sub-eco", day: "Friday", period: "P7", room: "Room 103" },
  { teacherId: "teach-014", classId: "class-11c", subjectId: "sub-ip",  day: "Friday", period: "P8", room: "Computer Lab B" },

  // --- Friday: Class XI-D ---
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Friday", period: "P1", room: "Room 104" },
  { teacherId: "teach-003", classId: "class-11d", subjectId: "sub-eng", day: "Friday", period: "P2", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Friday", period: "P3", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Friday", period: "P4", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Friday", period: "P5", room: "Room 104" },
  { teacherId: "teach-011", classId: "class-11d", subjectId: "sub-pol", day: "Friday", period: "P6", room: "Room 104" },
  { teacherId: "teach-012", classId: "class-11d", subjectId: "sub-geo", day: "Friday", period: "P7", room: "Room 104" },
  { teacherId: "teach-004", classId: "class-11d", subjectId: "sub-his", day: "Friday", period: "P8", room: "Room 104" },
];
`;

let content = fs.readFileSync(TARGET, "utf8");

// Normalize to LF so indexOf works on Windows (CRLF) files
const normalized = content.replace(/\r\n/g, "\n");

const tuesdayTokenIdx = normalized.indexOf(MARKER);
if (tuesdayTokenIdx === -1) {
  fs.writeFileSync("scripts/fix-log.txt", "ERROR: TUESDAY marker not found.\n");
  process.exit(1);
}

// Back up to find the opening '// ===' of the Tuesday section
const separatorMarker = "  // ============";
const sepIdx = normalized.lastIndexOf(separatorMarker, tuesdayTokenIdx);
if (sepIdx === -1) {
  fs.writeFileSync(
    "scripts/fix-log.txt",
    "ERROR: Tuesday separator block not found.\n",
  );
  process.exit(1);
}

const header = normalized.substring(0, sepIdx);
const newContent = header + NEW_TUE_FRI;

fs.writeFileSync(TARGET, newContent, "utf8");
console.log(`✓ Replaced Tuesday–Friday block in:\n  ${TARGET}`);
console.log(`  Header preserved: ${sepIdx} chars`);
console.log(`  New Tue–Fri block: ${NEW_TUE_FRI.length} chars`);
