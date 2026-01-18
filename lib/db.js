import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool;

function getPool() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!global._spvPool) {
    global._spvPool = new Pool({
      connectionString,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return global._spvPool;
}

export async function query(text, params) {
  pool = getPool();
  return pool.query(text, params);
}
