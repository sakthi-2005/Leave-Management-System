const express = require('express');
const db = require('../db');
const router = express.Router();
const { PositionsRepo } = require('../db');

router.patch('/updateLeave', async (req, res) => {

  const { leaveId } = req.body;
  if (!leaveId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const position = await PositionsRepo.findOne({
      select: ['id'],
      where: { name: leaveId.position },
    });

    await LeaveTypeRepo.save({
      id: leaveId.id,
      name: leaveId.name,
      monthly_allocation: leaveId.days_allowed,
      conformation_steps: leaveId.conformation_steps,
      position_id: position ? position.id : null,
    });

    // const[Id] = await db.query(`select id from positions where name = ?`,[leaveId.position])
    // const [rows] = await db.query(`UPDATE leave_types
    //                                   SET
    //                                       name = COALESCE(? , name),
    //                                       monthly_allocation = COALESCE(? , monthly_allocation),
    //                                       conformation_steps = COALESCE(? , conformation_steps),
    //                                       position_id = COALESCE(? , position_id)
    //                                   WHERE
    //                                       id = ?;`,[leaveId.name,leaveId.days_allowed,leaveId.conformation_steps,position.id,leaveId.id]);
    
    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to update leave' });
  }
});

module.exports = router;
