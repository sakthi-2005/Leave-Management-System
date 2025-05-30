// routes/leave.js
const express = require('express');
const db = require('../db');
const router = express.Router();
const { UserRepo , LeaveTypeRepo , LeaveRequestRepo , PositionsRepo } = require('../db');

// Get leave balance for a user
router.post('/request', async (req, res) => {
    let type = Number(req.body.type);
    let b = await getuserDetails(req.body.userId);
    let a = await getstepsRequired(type-1,b.role_id);

try {
  let id = await LeaveRequestRepo.createQueryBuilder('lr')
                  .select('MAX(lr.id) + 1', 'next_id')
                  .getRawOne();
    // let id = await db.query('SELECT MAX(id) + 1 AS next_id FROM leave_requests')
    await LeaveRequestRepo.save({
        id: id[0].next_id,                      // manually computed id
        user_id: req.body.userId,
        leave_type_id: a.id,
        from_date: req.body.from,
        to_date: req.body.to,
        description: req.body.reason,
        steps_required: a.conformation_steps,
        current_waiting: b.reporting_manager_id,
        no_of_days: req.body.noOfDays
      });

    // await db.query(
    //   `INSERT INTO leave_requests (id,user_id, leave_type_id, from_date, to_date, description, steps_required, current_waiting, no_of_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //   [id[0].next_id,req.body.userId,a.id,req.body.from,req.body.to,req.body.reason,a.conformation_steps,b.reporting_manager_id,req.body.noOfDays]
    // );

    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.json({ status: 'Failed requesting' });
  }
});

module.exports = router;

async function getstepsRequired(id,position_id){
    
    try {

      let positions = await PositionsRepo.count()
      const targetId = (positions * id) + position_id;


      const rows = await LeaveTypeRepo.findOne({
        select: ['conformation_steps', 'id'],
        where: { id: targetId },
      });

        // let [positions] = await db.query(`select count(*) as count from positions`);
        // const [rows] = await db.query(`select conformation_steps , id As type from leave_types where id=? `,[((positions[0].count)*id)+position_id]);

        return rows
      } catch (err) {
        console.log(err);
      }
}

async function getuserDetails(id){

    try {
      const rows = await UserRepo.findOne({
        select: ['reporting_manager_id', 'role_id'],
        where: { id: id },
      });

        // const [rows] = await db.query(`select reporting_manager_id,role_id from users where id=?`,[id]);
        return rows;
      } catch (err) {
        console.log(err);
      }
}