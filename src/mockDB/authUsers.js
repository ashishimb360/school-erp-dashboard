import { ROLES } from "../auth/roles";

export const generateAuthUsers = (db) => {
  const authUsers = [];

  // Students login using their admission number (admissionNo) as username
  db.students.forEach((student, index) => {
    authUsers.push({
      id: `auth_student_${index + 1}`,
      username: student.admissionNo,
      password: "demo123",
      role: ROLES.STUDENT,
      linkedEntityId: student.id,
      active: true,
    });
  });

  // Parents login using their child's admission number as username
  db.parents.forEach((parent, index) => {
    // Use the first child's admissionNo as the parent's login username
    const firstChildId = parent.childIds?.[0];
    const firstChild = db.students.find(s => s.id === firstChildId);
    const parentUsername = firstChild ? firstChild.admissionNo : `parent.${parent.name.split(' ').pop().toLowerCase()}`;

    authUsers.push({
      id: `auth_parent_${index + 1}`,
      username: parentUsername,
      password: "demo123",
      role: ROLES.PARENT,
      linkedEntityId: parent.id,
      active: true,
    });
  });

  db.teachers.forEach((teacher, index) => {
    const name = teacher.name || (teacher.metadata && teacher.metadata.name) || "";
    const nameWithoutTitle = name.replace(/(Dr\.|Prof\.|Mrs\.|Mr\.)\s+/g, '');
    const getFirstName = (n) => n.split(' ')[0].toLowerCase();
    authUsers.push({
      id: `auth_teacher_${index + 1}`,
      username: `teacher.${getFirstName(nameWithoutTitle)}`,
      password: "demo123",
      role: ROLES.TEACHER,
      linkedEntityId: teacher.id,
      active: true,
    });
  });

  authUsers.push({
    id: "auth_admin_1",
    username: "admin",
    password: "admin123",
    role: ROLES.ADMIN,
    linkedEntityId: "admin-001",
    active: true,
  });

  db.authUsers = authUsers;
};
