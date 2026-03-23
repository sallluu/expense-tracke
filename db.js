// db.js — Sets up the PostgreSQL connection pool using the pg library.
// The Pool object reuses connections efficiently instead of creating a new one per query.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render/ElephantSQL hosted DBs
  }
});

module.exports = pool;