// server.js — Entry point. Creates the Express app, sets up middleware, and starts listening.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────
app.use(cors());              // Allow cross-origin requests from frontend
app.use(express.json());      // Parse incoming JSON request bodies

// ─── Routes ──────────────────────────────────
app.use('/api/expenses', expenseRoutes);

// ─── Root health check ────────────────────────
app.get('/', (req, res) => {
  res.send('🧾 Expense Tracker API is running!');
});

// ─── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});