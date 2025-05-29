const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/allUsers', async(req,res)=>{

    try {
        const [rows] = await db.query(`select u.* , p.name as position from users u JOIN positions p ON u.role_id = p.id ORDER BY u.id ASC`);
        res.json({ users: rows });
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch' });
      }
});

module.exports = router;
