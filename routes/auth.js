// server/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'backendsecretkey';

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (role === 'admin') {
      const [rows] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
      const admin = rows[0];
      if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: admin.id, role: 'admin', name: admin.name }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
    } else if (role === 'teacher') {
      const [rows] = await pool.execute('SELECT * FROM teachers WHERE email = ?', [email]);
      const teacher = rows[0];
      if (!teacher) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, teacher.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: teacher.id, role: 'teacher', name: teacher.name }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, user: { id: teacher.id, name: teacher.name, email: teacher.email, role: 'teacher' } });
    } else {
      return res.status(400).json({ error: 'role must be admin or teacher' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
