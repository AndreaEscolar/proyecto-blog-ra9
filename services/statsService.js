const db = require("../db/pool");

function getStats() {
  // Totales
  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM posts) AS totalPosts,
      (SELECT COUNT(*) FROM comments) AS totalComments
  `).get();

  const avgPostBodyLenByUser = db.prepare(`
    SELECT u.username AS label, ROUND(AVG(LENGTH(p.body)), 0) AS value
    FROM users u
    JOIN posts p ON p.user_id = u.id
    GROUP BY u.id
    ORDER BY value DESC
  `).all();

  const topPostsByTitleLen = db.prepare(`
    SELECT p.title AS label, LENGTH(p.title) AS value
    FROM posts p
    ORDER BY value ASC
    LIMIT 10
  `).all();

  return {
    totals,
    avgPostBodyLenByUser,
    topPostsByTitleLen
  };
}

module.exports = { getStats };