const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/addLeave', async (req, res) => {

  let value = req.body.params.data;
  console.log(value);

  try {
    let [Id] = await db.query(`SELECT id from positions where name = ?`,[value.position])
    const [lId] = await db.query(`(select MAX(id) as id from leave_types)`)
    console.log(Id,lId);
    const [rows] = await db.query(`INSERT INTO leave_types (id,name,monthly_allocation,conformation_steps,position_id) VALUES (?, ?, ?, ?, ?)`,[lId[0].id+1,value.name,value.days_allowed,value.conformation_steps,Id[0].id]);
    
    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
