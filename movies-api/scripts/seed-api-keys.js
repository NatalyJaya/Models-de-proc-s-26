const db = require('../db');

async function seedApiKeys() {
  const entries = Object.entries(process.env)
    .filter(([key]) => /^API_KEY_LOCAL_\d+$/.test(key));

  if (entries.length === 0) {
    console.log('No API_KEY_LOCAL_* vars found. Skipping seed.');
    return;
  }

  for (const [, value] of entries) {
    const key = value.trim();
    if (!key) continue;
    const exists = await db.query(
      'SELECT id FROM api_keys WHERE api_key = $1', [key]
    );
    if (exists.rows.length === 0) {
      await db.query(
        `INSERT INTO api_keys (api_key, active, expires_at)
         VALUES ($1, true, NOW() + INTERVAL '30 days')`, [key]
      );
      console.log(`Seeded API key: ${key.slice(0, 12)}...`);
    }
  }
}

module.exports = seedApiKeys;
