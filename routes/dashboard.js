const express = require("express");
const { getStats } = require("../services/statsService");

const router = express.Router();

router.get("/dashboard", (req, res, next) => {
  try {
    const stats = getStats();
    res.render("dashboard", { stats });
  } catch (err) {
    next(err);
  }
});

module.exports = router;