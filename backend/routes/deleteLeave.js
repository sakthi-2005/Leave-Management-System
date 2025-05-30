const express = require('express');
const db = require('../db');
const router = express.Router();
const { LeaveTypeRepo } = require('../db');

router.delete('/deleteLeave', async (req, res) => {

  const Id = req.query.Id;
  if (!Id) return res.status(400).json({ error: 'Missing leaveType' });

  try {
    await LeaveTypeRepo.delete({id:Id});
    // await db.query(`DELETE FROM leaves WHERE id = ?;`,[Id]);
    
    res.json({ status: 'deleted' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to delete leave' });
  }
});

module.exports = router;
