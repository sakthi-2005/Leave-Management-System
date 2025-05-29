// routes/leave.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Get leave balance for a user
router.post('/request', async (req, res) => {
    let type = Number(req.body.type);
    let b = await getuserDetails(req.body.userId);
    let a = await getstepsRequired(type-1,b[0].role_id);

try {
    let id = await db.query('SELECT MAX(id) + 1 AS next_id FROM leave_requests')
    await db.query(
      `INSERT INTO leave_requests (id,user_id, leave_type_id, from_date, to_date, description, steps_required, current_waiting, no_of_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id[0].next_id,req.body.userId,a[0].type,req.body.from,req.body.to,req.body.reason,a[0].conformation_steps,b[0].reporting_manager_id,req.body.noOfDays]
    );

    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.json({ status: 'Failed requesting' });
  }
});

module.exports = router;

async function getstepsRequired(id,position_id){
    
    try {

        let [positions] = await db.query(`select count(*) as count from positions`);
        const [rows] = await db.query(`select conformation_steps , id As type from leave_types where id=? `,[((positions[0].count)*id)+position_id]);

        return [...rows,...positions];
      } catch (err) {
        console.log(err);
      }
}

async function getuserDetails(id){

    try {
        const [rows] = await db.query(`select reporting_manager_id,role_id from users where id=?`,[id]);
        return rows;
      } catch (err) {
        console.log(err);
      }
}