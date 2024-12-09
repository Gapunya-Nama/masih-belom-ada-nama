import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://gaPunyaNama:masihGapunyaNama@localhost:5433/dbGapunyanama',
  ssl: false
  
  // Dibawah adalah prod build
  // connectionString: 'postgresql://SIJARTA_owner:DClI4XAv0WuY@ep-weathered-violet-a16j35xm.ap-southeast-1.aws.neon.tech/SIJARTA?sslmode=require',
  // ssl: true
});


export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
