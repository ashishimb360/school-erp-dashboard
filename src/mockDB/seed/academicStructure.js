/**
 * Academic Structure Seed Data
 *
 * Defines the institutional academic infrastructure including:
 * - School periods and timing
 * - Room allocations
 * - Academic calendar structure
 * - Period distribution by grade level
 */

// Period timing structure
export const periodsSeed = [
  // Nursery to Class 1: 6 periods/day, Lunch after 3rd period
  {
    periodId: "p1-nursery",
    periodNumber: 1,
    startTime: "08:00",
    endTime: "08:45",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "academic",
  },
  {
    periodId: "p2-nursery",
    periodNumber: 2,
    startTime: "08:50",
    endTime: "09:35",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "academic",
  },
  {
    periodId: "p3-nursery",
    periodNumber: 3,
    startTime: "09:40",
    endTime: "10:25",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "academic",
  },
  {
    periodId: "lunch-nursery",
    periodNumber: 4,
    startTime: "10:25",
    endTime: "11:00",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "break",
  },
  {
    periodId: "p4-nursery",
    periodNumber: 5,
    startTime: "11:00",
    endTime: "11:45",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "academic",
  },
  {
    periodId: "p5-nursery",
    periodNumber: 6,
    startTime: "11:50",
    endTime: "12:35",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "academic",
  },
  {
    periodId: "dispersal-nursery",
    periodNumber: 7,
    startTime: "12:35",
    endTime: "13:00",
    applicableClasses: ["Nursery", "LKG", "UKG", "1"],
    periodType: "dispersal",
  },

  // Class 2 to Class 12: 8 periods/day, Lunch after 4th period
  {
    periodId: "p1-secondary",
    periodNumber: 1,
    startTime: "08:00",
    endTime: "08:45",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p2-secondary",
    periodNumber: 2,
    startTime: "08:50",
    endTime: "09:35",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p3-secondary",
    periodNumber: 3,
    startTime: "09:40",
    endTime: "10:25",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p4-secondary",
    periodNumber: 4,
    startTime: "10:30",
    endTime: "11:15",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "lunch-secondary",
    periodNumber: 5,
    startTime: "11:15",
    endTime: "11:50",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "break",
  },
  {
    periodId: "p5-secondary",
    periodNumber: 6,
    startTime: "11:50",
    endTime: "12:35",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p6-secondary",
    periodNumber: 7,
    startTime: "12:40",
    endTime: "13:25",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p7-secondary",
    periodNumber: 8,
    startTime: "13:30",
    endTime: "14:15",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
  {
    periodId: "p8-secondary",
    periodNumber: 9,
    startTime: "14:20",
    endTime: "15:05",
    applicableClasses: [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    periodType: "academic",
  },
];

// Room structure (fixed classroom model)
export const getRoomsSeed = () => {
  const rooms = [];
  const classLevels = [
    "Nursery",
    "LKG",
    "UKG",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const sections = ["A", "B", "C", "D"];

  classLevels.forEach((level) => {
    sections.forEach((sec) => {
      const roomNumber = ["Nursery", "LKG", "UKG"].includes(level)
        ? `N-${sec}`
        : `${level}${sec}`;

      rooms.push({
        roomId: `room-${level.toLowerCase()}${sec.toLowerCase()}`,
        roomNumber: roomNumber,
        roomType: "classroom",
        capacity: 40,
        assignedClass: `${level}-${sec}`,
        floor: ["Nursery", "LKG", "UKG", "1"].includes(level)
          ? "Ground"
          : level <= "5"
            ? "First"
            : level <= "8"
              ? "Second"
              : "Third",
        hasProjector: level >= "5",
        hasSmartBoard: level >= "8",
      });
    });
  });

  // Add special purpose rooms
  const specialRooms = [
    {
      roomId: "room-lab-phy",
      roomNumber: "Lab-PHY",
      roomType: "laboratory",
      capacity: 30,
      floor: "Third",
      subject: "Physics",
    },
    {
      roomId: "room-lab-chem",
      roomNumber: "Lab-CHEM",
      roomType: "laboratory",
      capacity: 30,
      floor: "Third",
      subject: "Chemistry",
    },
    {
      roomId: "room-lab-bio",
      roomNumber: "Lab-BIO",
      roomType: "laboratory",
      capacity: 30,
      floor: "Third",
      subject: "Biology",
    },
    {
      roomId: "room-lab-comp",
      roomNumber: "Lab-COMP",
      roomType: "laboratory",
      capacity: 40,
      floor: "Second",
      subject: "Computer Science",
    },
    {
      roomId: "room-library",
      roomNumber: "Library",
      roomType: "library",
      capacity: 60,
      floor: "Second",
    },
    {
      roomId: "room-audio",
      roomNumber: "Audio-Visual",
      roomType: "audio-visual",
      capacity: 100,
      floor: "Third",
    },
    {
      roomId: "room-art",
      roomNumber: "Art-Room",
      roomType: "activity",
      capacity: 30,
      floor: "First",
    },
    {
      roomId: "room-music",
      roomNumber: "Music-Room",
      roomType: "activity",
      capacity: 30,
      floor: "First",
    },
    {
      roomId: "room-pe",
      roomNumber: "Playground",
      roomType: "outdoor",
      capacity: 200,
      floor: "Ground",
    },
  ];

  rooms.push(...specialRooms);
  return rooms;
};

// Academic calendar structure
export const academicCalendarSeed = {
  academicYear: "2025-2026",
  startDate: "2025-04-01",
  endDate: "2026-03-31",
  terms: [
    {
      termId: "term-1",
      termName: "Term 1",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
      exams: ["Mid-Term Exam"],
    },
    {
      termId: "term-2",
      termName: "Term 2",
      startDate: "2025-10-01",
      endDate: "2026-03-31",
      exams: ["Final Exam"],
    },
  ],
  holidays: [
    { date: "2025-08-15", name: "Independence Day", type: "national" },
    { date: "2025-10-02", name: "Gandhi Jayanti", type: "national" },
    { date: "2025-12-25", name: "Christmas", type: "religious" },
    { date: "2026-01-26", name: "Republic Day", type: "national" },
    { date: "2026-03-25", name: "Holi", type: "religious" },
  ],
  workingDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

export default {
  periodsSeed,
  getRoomsSeed,
  academicCalendarSeed,
};
