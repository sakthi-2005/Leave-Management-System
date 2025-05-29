const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/allLeaves', async(req,res)=>{
    try {
        const [rows] = await db.query(`select lt.* , p.name as position from leave_types lt JOIN positions p on lt.position_id = p.id ORDER BY p.id DESC`);
        res.json({ leaves: rows });
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch' });
      }
});

module.exports = router;
