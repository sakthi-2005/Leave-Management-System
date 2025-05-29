// routes/leave.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Get leave balance for a user
router.get('/reportees', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(
      `SELECT 
            u.name,
            (
                SELECT lr.id 
                FROM leave_requests lr
                WHERE lr.user_id = u.id AND lr.status = 'completed'
                ORDER BY lr.id DESC
                LIMIT 1
            ) AS leave_request_id,
            (
                SELECT lr.from_date
                FROM leave_requests lr
                WHERE lr.user_id = u.id AND lr.status = 'completed'
                ORDER BY lr.id DESC
                LIMIT 1
            ) AS from_date,
            (
                SELECT lr.to_date
                FROM leave_requests lr
                WHERE lr.user_id = u.id AND lr.status = 'completed'
                ORDER BY lr.id DESC
                LIMIT 1
            ) AS to_date
        FROM 
            users u
        WHERE 
            u.reporting_manager_id = ?`,
      [userId,userId,userId]
    );
    
    

    res.json({ reportees: rows });
  } catch (err) {
    console.log(err)
    res.status(501).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
