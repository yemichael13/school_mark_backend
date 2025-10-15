// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const markRoutes = require('./routes/marks');
const teacherDataRoutes = require('./routes/teacherData');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' })); // allow Vite dev origin
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin/teachers', teacherRoutes);
app.use('/api/admin/students', studentRoutes);
app.use('/api/admin/subjects', subjectRoutes);
app.use('/api/admin/marks', markRoutes);

// Teacher routes
app.use('/api/teacher/marks', markRoutes);
app.use('/api/teacher', teacherDataRoutes);

// Legacy routes for backward compatibility
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/marks', markRoutes);

app.get('/api/ping', (req,res)=> res.json({ ok: true, msg: 'pong' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
