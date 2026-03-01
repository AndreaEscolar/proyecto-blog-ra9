// module.exports = (err, req, res, next) => {
//   console.error(err);

//   // API-like routes
//   if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/sync")) {
//     return res.status(500).json({
//       ok: false,
//       error: "INTERNAL_ERROR",
//       message: err.message,
//     });
//   }

//   res.status(500).send("Error interno");
// };
module.exports = (err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  console.error(err.stack);

  if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/sync")) {
    return res.status(500).json({ ok: false, message: err.message });
  }

  res.status(500).send("Error Interno");
};