// routes/leaveRequests.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all leave requests for a user
router.get('/leave-requests', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(
      `SELECT lr.id, lt.name AS leaveType, lr.description AS reason, 
              lr.status AS approvalStatus, lr.rejection_reason AS rejectionReason,
              DATEDIFF(lr.to_date, lr.from_date) + 1 AS noOfDays, lr.from_date, lr.to_date
       FROM leave_requests lr
       JOIN leave_types lt ON lr.leave_type_id = lt.id
       WHERE lr.user_id = ? 
       ORDER BY lr.from_date DESC`, // Order by the most recent leave request
      [userId]
    );

    res.json({ leaveRequests: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Placeholder for future leave request creation (to be developed later)
router.post('/request-leave', async (req, res) => {
  res.status(200).json({ message: 'Leave request feature coming soon!' });
});

module.exports = router;
