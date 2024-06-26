// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'DOCKER', // replace with your PostgreSQL username
  host: 'localhost', // replace with your PostgreSQL host
  database: 'polls', // replace with your PostgreSQL database name
  password: 'DOCKER', // replace with your PostgreSQL password
  port: 5432, // replace with your PostgreSQL port
});

module.exports = pool;