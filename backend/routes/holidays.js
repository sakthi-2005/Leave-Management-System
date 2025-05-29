// routes/leave.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Get leave balance for a user
router.get('/holiday', async (req, res) => {

  try {
    const [rows] = await db.query(`select * from holidays`);
    res.json({ holidays: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
