import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'gaPunyaNama',
  password: process.env.DB_PASSWORD || 'masihGapunyaNama',
  database: process.env.DB_NAME || 'dbGapunyanama',
});

export default pool;
