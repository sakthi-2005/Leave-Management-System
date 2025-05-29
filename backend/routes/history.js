const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/history', async (req, res) => {

  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(` SELECT 
    lr.*, 
    approver.name AS approved_by_name,
    rejector.name AS rejected_by_name,
    lt.name as leaveType
  FROM leave_requests lr
  LEFT JOIN users approver ON lr.approved_by = approver.id
  LEFT JOIN users rejector ON lr.rejected_by = rejector.id
  JOIN leave_types lt ON lr.leave_type_id = lt.id
  WHERE lr.user_id = ?`,[userId]);
    
    res.json({ history: rows });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
