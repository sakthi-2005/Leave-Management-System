const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/allUsers', async(req,res)=>{

    try {
        //const [rows] = await db.query(`select u.* , p.name as position from users u JOIN positions p ON u.role_id = p.id ORDER BY u.id ASC`);

        const [rows] = await db.UserRepo
                      .createQueryBuilder('u')
                      .innerJoin('u.role', 'p')
                      .addSelect('p.name', 'position')
                      .orderBy('u.id', 'ASC')
                      .getRawMany();

        res.json({ users: rows });
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch' });
      }
});

module.exports = router;
