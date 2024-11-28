import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://gaPunyaNama:masihGapunyaNama@db:5432/dbGapunyanama',
  ssl: false
});


export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
