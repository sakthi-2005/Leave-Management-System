const express = require('express');
const {LeaveBalanceRepo} = require('../db');
const router = express.Router();

router.get('/leave-balance', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {

    const result = await LeaveBalanceRepo
                            .createQueryBuilder('lb')
                            .innerJoin('leave_types', 'lt', 'lb.leave_type_id = lt.id')
                            .select([
                              'lt.name AS leaveType',
                              'lb.balance AS remainingLeaves',
                              'lb.leave_taken AS leavesTaken',
                            ])
                            .where('lb.user_id = :userId', { userId })
                            .getRawMany();


    // const [rows] = await db.query(
    //   `SELECT 
    //      lt.name AS leaveType, 
    //      lb.balance AS remainingLeaves,
    //      lb.leave_taken AS leavesTaken
    //    FROM leave_balances lb
    //    JOIN leave_types lt ON lb.leave_type_id = lt.id
    //    WHERE lb.user_id = ?`,
    //   [userId]
    // );
    
    res.json({ leaveBalances: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
