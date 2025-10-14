const express = require('express');
const router = express.Router();


const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Get all subjects (admin only) - matches /api/admin/subjects
router.get('/', auth, requireRole('admin'), async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT id, name, created_at FROM subjects');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Add new subject (admin only)
router.post('/', auth, requireRole('admin'), async (req, res) => {
	const { name } = req.body;
	try {
		const [result] = await pool.execute('INSERT INTO subjects (name) VALUES (?)', [name]);
		res.json({ id: result.insertId, message: 'Subject added successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update subject (admin only)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
	const { name } = req.body;
	const { id } = req.params;
	try {
		await pool.execute('UPDATE subjects SET name = ? WHERE id = ?', [name, id]);
		res.json({ message: 'Subject updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Delete subject (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
	const { id } = req.params;
	try {
		await pool.execute('DELETE FROM subjects WHERE id = ?', [id]);
		res.json({ message: 'Subject deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
