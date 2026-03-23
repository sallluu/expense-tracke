// db.js — Uses SQLite locally (no setup required)
const Database = require('better-sqlite3');
const db = new Database('expenses.db');

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT,
    date TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;