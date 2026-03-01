const db = require("../db/pool");

/**
 * Usa transacción para rendimiento en SQLite.
 */
function upsertMany(users) {
  if (!Array.isArray(users) || users.length === 0) return { inserted: 0 };

  const stmt = db.prepare(`
    INSERT INTO users (id, name, username, email)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      username=excluded.username,
      email=excluded.email
  `);

  const tx = db.transaction((rows) => {
    for (const u of rows) {
      stmt.run(u.id, u.name, u.username, u.email);
    }
  });

  tx(users);
  return { inserted: users.length };
}

function countAll() {
  return db.prepare(`SELECT COUNT(*) AS n FROM users`).get().n;
}

module.exports = {
  upsertMany,
  countAll,
};