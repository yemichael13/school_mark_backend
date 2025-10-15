// Teacher data access routes
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Get all students (teacher can read)
router.get('/students', auth, requireRole('teacher'), async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT id, name, class, created_at FROM students');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Get all subjects (teacher can read)
router.get('/subjects', auth, requireRole('teacher'), async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT id, name, created_at FROM subjects');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
