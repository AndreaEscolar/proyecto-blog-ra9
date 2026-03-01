const db = require("../db/pool");

function upsertMany(posts) {
  if (!Array.isArray(posts) || posts.length === 0) return { inserted: 0 };

  const stmt = db.prepare(`
    INSERT INTO posts (id, user_id, title, body)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      user_id=excluded.user_id,
      title=excluded.title,
      body=excluded.body
  `);

  const tx = db.transaction((rows) => {
    for (const p of rows) {
      stmt.run(p.id, p.userId, p.title, p.body);
    }
  });

  tx(posts);
  return { inserted: posts.length };
}

function countAll() {
  return db.prepare(`SELECT COUNT(*) AS n FROM posts`).get().n;
}

module.exports = {
  upsertMany,
  countAll,
};