/**
 * Expanded Students Seed Data
 *
 * Generates realistic Indian K-12 student population:
 * - Nursery to Class 12, 4 sections each
 * - Minimum 5 students per section
 * - Total: ~300 students
 * - Admission numbers: ADM2026XXXX format
 */

const CLASS_LEVELS = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SECTIONS = ["A", "B", "C", "D"];
const STREAMS = {
  "11": {
    "A": "Science Non-Medical",
    "B": "Science Medical",
    "C": "Commerce",
    "D": "Humanities"
  },
  "12": {
    "A": "Science Non-Medical",
    "B": "Science Medical",
    "C": "Commerce",
    "D": "Humanities"
  }
};

// Indian names for realistic student data
const indianFirstNames = {
  male: ["Arjun", "Aryan", "Rohan", "Aditya", "Vihaan", "Kabir", "Aarav", "Reyansh", "Atharv", "Vivaan", "Advik", "Ishaan", "Karthik", "Veer", "Shaurya", "Dhruv", "Arnav", "Sai", "Krishna", "Aayush", "Kairav", "Vansh", "Aryan", "Rudra", "Ayush"],
  female: ["Aarohi", "Ananya", "Diya", "Ishita", "Kavya", "Myra", "Navya", "Prisha", "Riya", "Saanvi", "Siya", "Zara", "Aadhya", "Anika", "Anvi", "Diya", "Ira", "Kavya", "Meera", "Pari", "Ridhima", "Sia", "Vanya", "Ananya", "Myra"]
};

const indianLastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Iyer", "Nair", "Menon", "Das", "Bose", "Mukherjee", "Chatterjee", "Sengupta", "Rao", "Naidu", "Pillai", "Shetty", "Bhat", "Kulkarni", "Desai", "Mehta", "Shah", "Jain", "Agarwal", "Goel", "Malhotra", "Khanna", "Saxena"];

// Helper to generate student ID
const generateStudentId = (index) => {
  return `stud-${String(index + 1).padStart(3, '0')}`;
};

// Helper to generate admission number
const generateAdmissionNo = (index) => {
  return `ADM2026${String(index + 1).padStart(4, '0')}`;
};

// Helper to generate class ID
const generateClassId = (level, section) => {
  return `class-${level.toLowerCase()}${section.toLowerCase()}`;
};

// Helper to generate phone number
const generatePhone = (base) => {
  return `+91 98765 ${String(base).padStart(5, '0')}`;
};

// Helper to generate email
const generateEmail = (name, admissionNo) => {
  const [firstName, lastName] = name.toLowerCase().split(' ');
  return `${firstName}.${lastName.substring(0, 3)}${admissionNo.slice(-4)}@school.edu`;
};

// Generate students for a given class and section
const generateSectionStudents = (level, section, startIndex) => {
  const students = [];
  const classId = generateClassId(level, section);
  const stream = STREAMS[level] ? STREAMS[level][section] : null;
  const studentCount = level === "Nursery" || level === "LKG" || level === "UKG" ? 6 : 5; // More students in foundation classes

  for (let i = 0; i < studentCount; i++) {
    const gender = Math.random() > 0.45 ? 'male' : 'female';
    const firstName = indianFirstNames[gender][Math.floor(Math.random() * indianFirstNames[gender].length)];
    const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
    const name = `${firstName} ${lastName}`;
    const admissionNo = generateAdmissionNo(startIndex + i);
    const studentId = generateStudentId(startIndex + i);

    students.push({
      studentId: studentId,
      id: studentId,
      admissionNo: admissionNo,
      name: name,
      userId: `user-stud-${startIndex + i + 1}`,
      classId: classId,
      className: `${level}-${section}`,
      section: section,
      classLevel: level,
      stream: stream,
      parentIds: [`parent-${startIndex + i + 1}`],
      siblingMetadata: [],
      guardianLinkage: {
        guardianName: `${firstName} ${lastName}`,
        relationship: "Father",
        contactNumber: generatePhone(60000 + startIndex + i),
      },
      emergencyContacts: [
        {
          name: `${firstName} ${lastName}`,
          relationship: "Father",
          contactNumber: generatePhone(60000 + startIndex + i),
        },
      ],
      dob: generateDOB(level),
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      bloodGroup: getRandomBloodGroup(),
      address: `${Math.floor(Math.random() * 100) + 1}, School Road, New Delhi, India`,
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      enrollmentDate: "2025-04-01",
      academicYear: "2025-2026",
      status: "Active",
      photoUrl: null,
      transportRoute: Math.random() > 0.3 ? `Route-${String.fromCharCode(65 + Math.floor(Math.random() * 4))}` : null,
      feeConcession: null,
    });
  }

  return students;
};

// Helper to generate date of birth based on class level
const generateDOB = (level) => {
  const currentYear = 2026;
  const ageMap = {
    "Nursery": 3,
    "LKG": 4,
    "UKG": 5,
    "1": 6,
    "2": 7,
    "3": 8,
    "4": 9,
    "5": 10,
    "6": 11,
    "7": 12,
    "8": 13,
    "9": 14,
    "10": 15,
    "11": 16,
    "12": 17
  };
  const age = ageMap[level] || 10;
  const birthYear = currentYear - age;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${birthYear}-${month}-${day}`;
};

// Helper to get random blood group
const getRandomBloodGroup = () => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
};

// Generate all students
export const generateExpandedStudents = () => {
  const allStudents = [];
  let studentIndex = 0;

  CLASS_LEVELS.forEach((level) => {
    SECTIONS.forEach((section) => {
      const sectionStudents = generateSectionStudents(level, section, studentIndex);
      allStudents.push(...sectionStudents);
      studentIndex += sectionStudents.length;
    });
  });

  return allStudents;
};

// Generate parents corresponding to students
export const generateExpandedParents = (students) => {
  const parents = [];

  students.forEach((student, index) => {
    const [firstName, lastName] = student.name.split(' ');
    const parentId = `parent-${index + 1}`;

    parents.push({
      parentId: parentId,
      id: parentId,
      userId: `user-parent-${index + 1}`,
      name: `${firstName} ${lastName}`,
      relationship: "Father",
      phoneNumber: student.emergencyContacts[0].contactNumber,
      email: generateEmail(`${firstName} ${lastName}`, student.admissionNo),
      address: student.address,
      city: student.city,
      state: student.state,
      pincode: student.pincode,
      occupation: getRandomOccupation(),
      income: getRandomIncome(),
      childIds: [student.studentId],
      emergencyContact: student.emergencyContacts[0].contactNumber,
      education: getRandomEducation(),
      maritalStatus: "Married",
      photoUrl: null,
    });
  });

  return parents;
};

// Helper to get random occupation
const getRandomOccupation = () => {
  const occupations = ["Business", "Government Employee", "Private Sector", "Professional", "Self-Employed", "Doctor", "Engineer", "Teacher", "Lawyer", "Accountant"];
  return occupations[Math.floor(Math.random() * occupations.length)];
};

// Helper to get random income
const getRandomIncome = () => {
  const incomes = ["5-10 LPA", "10-15 LPA", "15-20 LPA", "20-25 LPA", "25+ LPA"];
  return incomes[Math.floor(Math.random() * incomes.length)];
};

// Helper to get random education
const getRandomEducation = () => {
  const educations = ["Graduate", "Post Graduate", "Professional", "Doctorate", "Others"];
  return educations[Math.floor(Math.random() * educations.length)];
};

export default generateExpandedStudents;
