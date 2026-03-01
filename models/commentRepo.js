const db = require("../db/pool");

function upsertMany(comments) {
  if (!Array.isArray(comments) || comments.length === 0) return { inserted: 0 };

  const stmt = db.prepare(`
    INSERT INTO comments (id, post_id, name, email, body)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      post_id=excluded.post_id,
      name=excluded.name,
      email=excluded.email,
      body=excluded.body
  `);

  const tx = db.transaction((rows) => {
    for (const c of rows) {
      stmt.run(c.id, c.postId, c.name, c.email, c.body);
    }
  });

  tx(comments);
  return { inserted: comments.length };
}

function countAll() {
  return db.prepare(`SELECT COUNT(*) AS n FROM comments`).get().n;
}

module.exports = {
  upsertMany,
  countAll,
};