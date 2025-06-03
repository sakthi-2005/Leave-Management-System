const express = require('express');
const db = require('../db');
const router = express.Router();
const {  HolidaysRepo } = require('../db');

// Get leave balance for a user
router.get('/holiday', async (req, res) => {

  try {
    const rows = await HolidaysRepo.find();

    // const [rows] = await db.query(`select * from holidays`);
    res.json({ holidays: rows });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});

module.exports = router;
