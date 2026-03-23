// expenses.js — All API routes for CRUD operations on expenses.
// CRUD = Create, Read, Update, Delete

const express = require('express');
const router = express.Router();
const pool = require('../db');

// ─────────────────────────────────────────────
// CREATE TABLE (run once at server start)
// ─────────────────────────────────────────────
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      category VARCHAR(50),
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Expenses table ready');
};
createTable();

// ─────────────────────────────────────────────
// GET /api/expenses — Fetch all expenses
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(result.rows); // Send rows as JSON array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/expenses — Add a new expense
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { title, amount, category, date } = req.body;

  // Input validation
  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, amount, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/expenses/:id — Remove an expense
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/expenses/contact — Contact form handler
// ─────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  const { name, gmail, message } = req.body;
  if (!name || !gmail || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // In production, you'd send an email here (e.g., using Nodemailer)
  console.log(`📩 Contact from ${name} <${gmail}>: ${message}`);
  res.json({ success: true, message: 'Message received!' });
});

module.exports = router;