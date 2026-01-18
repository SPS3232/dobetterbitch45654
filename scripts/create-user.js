const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const email = (process.env.USER_EMAIL || '').toLowerCase().trim();
const password = process.env.USER_PASSWORD || '';
const businessId = process.env.BUSINESS_ID || '';
const databaseUrl = process.env.DATABASE_URL || '';

if (!email || !password || !businessId || !databaseUrl) {
  console.error('Usage: USER_EMAIL=... USER_PASSWORD=... BUSINESS_ID=... DATABASE_URL=... node scripts/create-user.js');
  process.exit(1);
}

async function main() {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
  });

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (business_id, email, password_hash, status)
     VALUES ($1, $2, $3, 'active')
     ON CONFLICT (email)
     DO UPDATE SET business_id = EXCLUDED.business_id,
                   password_hash = EXCLUDED.password_hash,
                   status = 'active',
                   updated_at = NOW();`,
    [businessId, email, passwordHash]
  );

  await pool.end();
  console.log('User created/updated:', email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});