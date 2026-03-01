const express = require("express");
const { syncAll } = require("../services/syncService");

const router = express.Router();

router.get("/sync", async (req, res, next) => {
  try {
    const result = await syncAll();
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;