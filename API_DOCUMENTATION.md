# School Mark Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /api/auth/login
Login for admin or teacher

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin" // or "teacher"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin"
  }
}
```

### Admin Routes

#### Teachers Management

**GET /api/admin/teachers**
Get all teachers (Admin only)

**POST /api/admin/teachers**
Add new teacher (Admin only)
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "password123"
}
```

**PUT /api/admin/teachers/:id**
Update teacher (Admin only)

**DELETE /api/admin/teachers/:id**
Delete teacher (Admin only)

#### Students Management

**GET /api/admin/students**
Get all students (Admin only)

**POST /api/admin/students**
Add new student (Admin only)
```json
{
  "name": "Jane Smith",
  "class": "Grade 8"
}
```

**PUT /api/admin/students/:id**
Update student (Admin only)

**DELETE /api/admin/students/:id**
Delete student (Admin only)

#### Subjects Management

**GET /api/admin/subjects**
Get all subjects (Admin only)

**POST /api/admin/subjects**
Add new subject (Admin only)
```json
{
  "name": "Mathematics"
}
```

**PUT /api/admin/subjects/:id**
Update subject (Admin only)

**DELETE /api/admin/subjects/:id**
Delete subject (Admin only)

#### Marks Management (Admin View)

**GET /api/admin/marks**
Get all marks (Admin only)
- Query params: `?term=Term1&class=Grade 8`

### Teacher Routes

#### Marks Management

**POST /api/teacher/marks**
Add mark for student (Teacher only)
```json
{
  "student_id": 1,
  "subject_id": 1,
  "term": "Term1",
  "mark": 85
}
```

**GET /api/teacher/marks/:student_id**
Get marks for specific student (Teacher only)
- Query params: `?term=Term1`
- Returns: marks, sum, average, totalMarks, rank

**PUT /api/teacher/marks/:id**
Update mark (Teacher only)
```json
{
  "mark": 90
}
```

**DELETE /api/teacher/marks/:id**
Delete mark (Teacher only)

## Grade Calculation
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

## Terms
- Term1
- Term2

## Error Responses
```json
{
  "error": "Error message"
}
```

## Success Responses
```json
{
  "message": "Operation successful",
  "id": 123 // for create operations
}
```

## Test Credentials

### Admin
- Email: admin@school.com
- Password: admin123

### Teacher
- Email: alice@school.com
- Password: teacher123

## CORS
Frontend origin: http://localhost:5173
