const express = require('express');
const db = require('../db');
const router = express.Router();

router.patch('/accept-request', async (req, res) => {

  const { userId, reqId } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [rows] = await db.query(`  UPDATE leave_requests rr
                                          JOIN users u ON u.id = rr.current_waiting
                                          SET 
                                            rr.status = CASE 
                                                          WHEN rr.steps_required = rr.steps_completed + 1 THEN 'approved' 
                                                          ELSE 'pending' 
                                                      END,
                                            rr.current_waiting = CASE 
                                                                  WHEN rr.steps_required = rr.steps_completed + 1 THEN NULL 
                                                                  ELSE u.reporting_manager_id
                                                                END,
                                            rr.approved_by = CASE 
                                                              WHEN rr.steps_required = rr.steps_completed + 1 THEN ?
                                                              ELSE NULL
                                                            END,
                                            rr.steps_completed = rr.steps_completed + 1
                                          WHERE rr.id = ? `,[userId,reqId]);

    await db.query(`UPDATE leave_balances lb
                    JOIN leave_requests lr ON lr.user_id = lb.user_id AND lr.leave_type_id = lb.leave_type_id
                    SET lb.leave_taken = lb.leave_taken + lr.no_of_days , lb.balance = lb.balance - lr.no_of_days
                    WHERE lr.id = ?`,[reqId])

    
    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;
