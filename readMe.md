# School Mark Management System - Backend

A Node.js/Express backend for managing school marks, students, teachers, and subjects.

## Features

- **Authentication**: JWT-based authentication for admin and teacher roles
- **Student Management**: CRUD operations for students
- **Teacher Management**: CRUD operations for teachers  
- **Subject Management**: CRUD operations for subjects
- **Mark Management**: Record and calculate student marks with automatic grading
- **Ranking System**: Calculate student rankings within classes
- **Term Management**: Support for Term1 and Term2
- **Grade Calculation**: Automatic A-F grading based on marks

## Prerequisites

- Node.js (v14 or higher)
- MySQL (via XAMPP or standalone)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASS=
   DB_NAME=school_mark_db

   # Server Configuration
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Set up the database**
   ```bash
   npm run setup-db
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

The API is documented in `API_DOCUMENTATION.md`. Key endpoints:

### Authentication
- `POST /api/auth/login` - Login for admin or teacher

### Admin Routes
- `GET /api/admin/teachers` - Get all teachers
- `POST /api/admin/teachers` - Add new teacher
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add new student
- `GET /api/admin/subjects` - Get all subjects
- `POST /api/admin/subjects` - Add new subject
- `GET /api/admin/marks` - Get all marks

### Teacher Routes
- `POST /api/teacher/marks` - Add mark for student
- `GET /api/teacher/marks/:student_id` - Get marks for specific student
- `PUT /api/teacher/marks/:id` - Update mark
- `DELETE /api/teacher/marks/:id` - Delete mark

## Testing

Run the API tests:
```bash
npm run test-api
```

## Database Schema

### Tables
- **admins**: id, name, email, password, created_at
- **teachers**: id, name, email, password, created_at
- **students**: id, name, class, created_at
- **subjects**: id, name, created_at
- **marks**: id, student_id, subject_id, teacher_id, term, mark, grade, created_at

### Relationships
- marks.student_id → students.id
- marks.subject_id → subjects.id
- marks.teacher_id → teachers.id

## Grade System

- **A**: 90-100
- **B**: 80-89
- **C**: 70-79
- **D**: 60-69
- **F**: 0-59

## Default Credentials

### Admin
- Email: admin@school.com
- Password: admin123

### Teachers
- Email: alice@school.com
- Password: teacher123
- Email: bob@school.com
- Password: teacher123

## Frontend Integration

The backend is configured to work with a Vite React frontend running on `http://localhost:5173`.

### CORS Configuration
The server allows requests from the frontend origin specified in the `CORS_ORIGIN` environment variable.

### API Base URL
For frontend integration, use: `http://localhost:5000/api`

## Deployment

### Environment Variables for Production
- Set `JWT_SECRET` to a strong, random string
- Configure database connection details
- Set appropriate `CORS_ORIGIN` for your frontend domain

### Database Setup
1. Create the database using the migration script
2. Run the seed script to populate initial data
3. Update environment variables with production database credentials

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm run setup-db` - Set up the database with tables and sample data
- `npm run test-api` - Run API tests

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation
- SQL injection prevention with parameterized queries

## License

ISC