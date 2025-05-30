// routes/leave.js
const express = require('express');
const db = require('../db');
const router = express.Router();
const { UserRepo } = require('../db');
// Get leave balance for a user
router.get('/reportees', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {

    const rows = await UserRepo
                  .createQueryBuilder('u')
                  .leftJoinAndSelect(
                    qb => {
                      return qb
                        .from('leave_requests', 'lr')
                        .where('lr.status = :completed', { completed: 'completed' })
                        .orderBy('lr.id', 'DESC');
                    },
                    'lr',
                    'lr.user_id = u.id'
                  )
                  .select([
                    'u.name AS name',
                    'lr.id AS leave_request_id',
                    'lr.from_date AS from_date',
                    'lr.to_date AS to_date',
                  ])
                  .where('u.reporting_manager_id = :managerId', { managerId: userId })
                  .groupBy('u.id')
                  .getRawMany();


    // const [rows] = await db.query(
    //   `SELECT 
    //         u.name,
    //         (
    //             SELECT lr.id 
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS leave_request_id,
    //         (
    //             SELECT lr.from_date
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS from_date,
    //         (
    //             SELECT lr.to_date
    //             FROM leave_requests lr
    //             WHERE lr.user_id = u.id AND lr.status = 'completed'
    //             ORDER BY lr.id DESC
    //             LIMIT 1
    //         ) AS to_date
    //     FROM 
    //         users u
    //     WHERE 
    //         u.reporting_manager_id = ?`,
    //   [userId,userId,userId]
    // );
    
    

    res.json({ reportees: rows });
  } catch (err) {
    console.log(err)
    res.status(501).json({ error: 'Failed to fetch reportees' });
  }
});

module.exports = router;
