const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/calendarLeaves', async (req, res) => {

    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(`SELECT lr.* , u.name , lt.name as Type
                                        FROM leave_requests lr
                                        JOIN users u ON lr.user_id = u.id
                                        JOIN leave_types lt on lt.id = lr.leave_type_id
                                        WHERE u.reporting_manager_id = ?
                                        AND lr.status = 'approved';
                                        `,[userId]);
    res.json({ leaves: rows });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
