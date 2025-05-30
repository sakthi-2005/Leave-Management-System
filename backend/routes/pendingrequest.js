const express = require('express');
const db = require('../db');
const router = express.Router();
const { LeaveRequestRepo } = require('../db');

router.get('/pendingrequest', async (req, res) => {

  try {
    const rows = await LeaveRequestRepo
                    .createQueryBuilder('lr')
                    .innerJoin('users', 'u')
                    .innerJoin('leave_types', 'lt')
                    .select([
                      'lr.*',
                      'u.name AS user_name',
                      'lt.name AS type',
                    ])
                    .where('lr.current_waiting = :userId', { userId })
                    .getRawMany();

    // const [rows] = await db.query(`SELECT 
    //                                 leave_requests.*, 
    //                                 users.name AS user_name,
    //                                 leave_types.name AS type
    //                                 FROM leave_requests
    //                                 JOIN users ON leave_requests.user_id = users.id
    //                                 JOIN leave_types ON leave_requests.leave_type_id = leave_types.id
    //                                 WHERE leave_requests.current_waiting = ?;
    //                                 `,[req.query.userId]);

    // console.log(rows);


    res.json({ leaveRequestes: rows });
  } catch (err) {
    res.status(503).json({ error: 'Failed to fetch leave request' });
  }
});

module.exports = router;
