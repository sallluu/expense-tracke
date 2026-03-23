const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all expenses
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add expense
router.post('/', (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount required.' });
  }
  try {
    const stmt = db.prepare(
      'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(title, amount, category, date || new Date().toISOString().split('T')[0]);
    const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST contact
router.post('/contact', (req, res) => {
  const { name, gmail, message } = req.body;
  if (!name || !gmail || !message) {
    return res.status(400).json({ error: 'All fields required.' });
  }
  console.log(`📩 Contact: ${name} <${gmail}> — ${message}`);
  res.json({ success: true, message: 'Message received!' });
});

module.exports = router;