const express = require('express');
const db = require('../db');
const router = express.Router();

router.delete('/deleteRequest', async (req, res) => {

    const lrId = req.query.lrId;
    if (!lrId) return res.status(400).json({ error: 'Missing lrId' });

  try {
    await db.query(`UPDATE leave_balances lb 
                                        JOIN leave_requests lr ON
                                        lb.leave_type_id = lr.leave_type_id AND
                                        lb.user_id = lr.user_id
                                        SET 
                                            lb.balance = lb.balance + lr.no_of_days,
                                            lb.leave_taken = lb.leave_taken - lr.no_of_days
                                        WHERE
                                            lr.id = ?
                                        `,[lrId]);

    await db.query(`DELETE from leave_requests where id = ?`,[lrId]);
    res.json({ status: 'deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
