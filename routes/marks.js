const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Helper: calculate grade based on mark
function calculateGrade(mark) {
	if (mark >= 90) return 'A';
	if (mark >= 80) return 'B';
	if (mark >= 70) return 'C';
	if (mark >= 60) return 'D';
	return 'F';
}

// Add mark (teacher only) - matches /api/teacher/add-mark
router.post('/', auth, requireRole('teacher'), async (req, res) => {
	const { student_id, subject_id, term, mark } = req.body;
	const teacher_id = req.user.id;
	
	// Validate input
	if (!student_id || !subject_id || !term || mark === undefined) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	
	if (mark < 0 || mark > 100) {
		return res.status(400).json({ error: 'Mark must be between 0 and 100' });
	}
	
	if (!['Term1', 'Term2'].includes(term)) {
		return res.status(400).json({ error: 'Term must be Term1 or Term2' });
	}
	
	const grade = calculateGrade(mark);
	
	try {
		// Check if mark already exists for this student, subject, and term
		const [existing] = await pool.execute(
			'SELECT id FROM marks WHERE student_id = ? AND subject_id = ? AND term = ?',
			[student_id, subject_id, term]
		);
		
		if (existing.length > 0) {
			return res.status(400).json({ error: 'Mark already exists for this student, subject, and term' });
		}
		
		const [result] = await pool.execute(
			'INSERT INTO marks (student_id, subject_id, teacher_id, term, mark, grade) VALUES (?, ?, ?, ?, ?, ?)',
			[student_id, subject_id, teacher_id, term, mark, grade]
		);
		res.json({ id: result.insertId, message: 'Mark added successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Get marks for a student (teacher only) - matches /api/teacher/marks/:student_id
router.get('/:student_id', auth, requireRole('teacher'), async (req, res) => {
	const { student_id } = req.params;
	const { term } = req.query;
	
	try {
		let query = `
			SELECT m.*, s.name as subject_name, st.name as student_name, st.class
			FROM marks m 
			JOIN subjects s ON m.subject_id = s.id 
			JOIN students st ON m.student_id = st.id 
			WHERE m.student_id = ?
		`;
		let params = [student_id];
		
		if (term) {
			query += ' AND m.term = ?';
			params.push(term);
		}
		
		query += ' ORDER BY s.name';
		
		const [rows] = await pool.execute(query, params);
		
		// Calculate sum, average, and rank
		const sum = rows.reduce((acc, cur) => acc + parseFloat(cur.mark), 0);
		const avg = rows.length ? sum / rows.length : 0;
		const totalMarks = rows.length;
		
		// Calculate rank within class for the term
		let rank = null;
		if (rows.length > 0) {
			const studentClass = rows[0].class;
			const currentTerm = term || rows[0].term;
			
			const [rankQuery] = await pool.execute(`
				SELECT 
					student_id,
					SUM(mark) as total_marks,
					RANK() OVER (ORDER BY SUM(mark) DESC) as student_rank
				FROM marks m
				JOIN students s ON m.student_id = s.id
				WHERE s.class = ? AND m.term = ?
				GROUP BY student_id
				ORDER BY total_marks DESC
			`, [studentClass, currentTerm]);
			
			const studentRank = rankQuery.find(r => r.student_id == student_id);
			rank = studentRank ? studentRank.student_rank : null;
		}
		
		res.json({ 
			marks: rows, 
			sum: parseFloat(sum.toFixed(2)), 
			average: parseFloat(avg.toFixed(2)),
			totalMarks,
			rank
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Get all marks (admin only) - for admin to view all marks
router.get('/', auth, requireRole('admin'), async (req, res) => {
	const { term, class: studentClass } = req.query;
	
	try {
		let query = `
			SELECT m.*, s.name as subject_name, st.name as student_name, st.class, t.name as teacher_name
			FROM marks m 
			JOIN subjects s ON m.subject_id = s.id 
			JOIN students st ON m.student_id = st.id 
			JOIN teachers t ON m.teacher_id = t.id
		`;
		let params = [];
		let conditions = [];
		
		if (term) {
			conditions.push('m.term = ?');
			params.push(term);
		}
		
		if (studentClass) {
			conditions.push('st.class = ?');
			params.push(studentClass);
		}
		
		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ');
		}
		
		query += ' ORDER BY st.class, st.name, s.name';
		
		const [rows] = await pool.execute(query, params);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Update mark (teacher only)
router.put('/:id', auth, requireRole('teacher'), async (req, res) => {
	const { mark } = req.body;
	const { id } = req.params;
	
	if (mark === undefined) {
		return res.status(400).json({ error: 'Mark is required' });
	}
	
	if (mark < 0 || mark > 100) {
		return res.status(400).json({ error: 'Mark must be between 0 and 100' });
	}
	
	const grade = calculateGrade(mark);
	
	try {
		await pool.execute('UPDATE marks SET mark = ?, grade = ? WHERE id = ?', [mark, grade, id]);
		res.json({ message: 'Mark updated successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

// Delete mark (teacher only)
router.delete('/:id', auth, requireRole('teacher'), async (req, res) => {
	const { id } = req.params;
	
	try {
		await pool.execute('DELETE FROM marks WHERE id = ?', [id]);
		res.json({ message: 'Mark deleted successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
