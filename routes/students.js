const express = require('express');
const router = express.Router();


const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Get all students (admin only) - matches /api/admin/students
router.get('/', auth, requireRole('admin'), async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT id, name, class, created_at FROM students');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Add new student (admin only) - matches /api/admin/add-student
router.post('/', auth, requireRole('admin'), async (req, res) => {
	const { name, class: studentClass } = req.body;
	try {
		const [result] = await pool.execute('INSERT INTO students (name, class) VALUES (?, ?)', [name, studentClass]);
		res.json({ id: result.insertId, message: 'Student added successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update student (admin only)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
	const { name, class: studentClass } = req.body;
	const { id } = req.params;
	try {
		await pool.execute('UPDATE students SET name = ?, class = ? WHERE id = ?', [name, studentClass, id]);
		res.json({ message: 'Student updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Delete student (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
	const { id } = req.params;
	try {
		await pool.execute('DELETE FROM students WHERE id = ?', [id]);
		res.json({ message: 'Student deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
