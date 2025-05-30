const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/userDetails', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const rows = await UsersRepo.createQueryBuilder('u')
                  .innerJoin('users', 'm', 'u.reporting_manager_id = m.id')
                  .innerJoin('positions', 'p', 'u.role_id = p.id')
                  .select(['u', 'p.name AS position', 'm.name AS Manager'])
                  .where('u.id = :userId', { userId })
                  .getRawOne();
    // const [rows] = await db.query(`SELECT u.*,p.name as position,m.name as Manager from users u JOIN users m ON u.reporting_manager_id = m.id JOIN positions p ON u.role_id = p.id WHERE u.id = ?`,[userId]);

    res.json({ userDetails: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
