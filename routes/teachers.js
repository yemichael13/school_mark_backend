const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const bcrypt = require('bcryptjs');

// Get all teachers (admin only) - matches /api/admin/teachers
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM teachers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new teacher (admin only) - matches /api/admin/add-teacher
router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.execute('INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    res.json({ id: result.insertId, message: 'Teacher added successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Update teacher (admin only)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;
  try {
    let query = 'UPDATE teachers SET name = ?, email = ?';
    let params = [name, email];
    
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashed);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await pool.execute(query, params);
    res.json({ message: 'Teacher updated successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Delete teacher (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM teachers WHERE id = ?', [id]);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
