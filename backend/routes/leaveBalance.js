const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/leave-balance', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(
      `SELECT 
         lt.name AS leaveType, 
         lb.balance AS remainingLeaves,
         lb.leave_taken AS leavesTaken
       FROM leave_balances lb
       JOIN leave_types lt ON lb.leave_type_id = lt.id
       WHERE lb.user_id = ?`,
      [userId]
    );
    
    

    res.json({ leaveBalances: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
