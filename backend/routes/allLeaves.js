const express = require('express');
const db = require('../db');
const router = express.Router();
const { LeaveTypeRepo } = require('../db');

router.get('/allLeaves', async(req,res)=>{
    try {
        // const [rows] = await db.query(`select lt.* , p.name as position from leave_types lt JOIN positions p on lt.position_id = p.id ORDER BY p.id DESC`);
        const [rows] = await LeaveTypeRepo
                                .createQueryBuilder('lt')
                                .innerJoin('lt.position', 'p')
                                .addSelect('p.name', 'position')
                                .orderBy('p.id', 'DESC')
                                .getRawMany();
        res.json({ leaves: rows });
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch' });
      }
});

module.exports = router;
