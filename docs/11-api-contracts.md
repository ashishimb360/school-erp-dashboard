# EduDash API Contracts (Frontend ↔ Backend)

This document formalizes the exact request/response boundaries that the frontend expects from the backend. The backend must strictly implement these boundaries.

## 1. Authentication
Endpoints governing user sessions and access control.

### `POST /api/v1/auth/login`
- **Request Body:** `{ username, password }`
- **Response Shape:** `LoginResponseDTO`
```json
{
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string",
  "user": {
    "id": "user-uuid",
    "role": "ADMIN|TEACHER|STUDENT|PARENT",
    "name": "Full Name",
    "email": "user@school.edu"
  },
  "permissions": ["MANAGE_USERS", "MANAGE_FEES"]
}
```

### `GET /api/v1/auth/me`
- **Response Shape:** `CurrentUserDTO`

---

## 2. Students
Endpoints governing student data.

### `GET /api/v1/students/:id`
- **Response Shape:** `StudentProfileDTO`
```json
{
  "id": "stud-123",
  "admissionNo": "2024001",
  "name": "John Doe",
  "classId": "class-10a",
  "className": "10-A",
  "streamId": null,
  "parentId": "parent-456"
}
```

### `GET /api/v1/students/:id/dashboard`
- **Response Shape:** `StudentDashboardDTO`

---

## 3. Teachers
Endpoints governing faculty operations.

### `GET /api/v1/teachers/:id`
- **Response Shape:** `TeacherProfileDTO`
```json
{
  "id": "teacher-001",
  "employeeId": "EMP2019",
  "name": "Jane Smith",
  "department": "Science",
  "subjects": ["sub-phy", "sub-chem"],
  "classesAssigned": ["class-11a", "class-11b"]
}
```

### `GET /api/v1/teachers/:id/dashboard`
- **Response Shape:** `TeacherDashboardDTO`

---

## 4. Academics
Endpoints for assignments, exams, and question papers.

### `POST /api/v1/academics/question-papers`
- **Request/Response Shape:** `QuestionPaperDTO`
```json
{
  "id": "qp-uuid",
  "title": "Midterm Physics",
  "classId": "class-11a",
  "section": "A",
  "subjectId": "sub-phy",
  "teacherId": "teacher-001",
  "status": "Draft",
  "content": "<p>Rich text question content...</p>",
  "uploadedFile": "url-to-pdf",
  "remarks": "",
  "createdAt": "2025-10-01T10:00:00Z",
  "updatedAt": "2025-10-01T10:00:00Z"
}
```

### `GET /api/v1/academics/assignments`
- **Response Shape:** `AssignmentDTO[]`

### `GET /api/v1/academics/exams/:examId/results/:studentId`
- **Response Shape:** `ExamResultDTO`
```json
{
  "examId": "exam-midterm-2025",
  "studentId": "stud-123",
  "aggregatePercentage": 85.5,
  "subjectMarks": [
    { "subjectId": "sub-phy", "marksObtained": 85, "maxMarks": 100 }
  ]
}
```

---

## 5. Parents
Endpoints for parent portal access.

### `GET /api/v1/parents/:id`
- **Response Shape:** `ParentProfileDTO`
```json
{
  "id": "parent-456",
  "name": "Robert Doe",
  "email": "robert@email.com",
  "phoneNumber": "+91 9876543210",
  "children": ["stud-123"]
}
```
