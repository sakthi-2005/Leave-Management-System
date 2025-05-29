const express = require('express');
const db = require('../db');
const router = express.Router();

router.patch('/reject-request', async (req, res) => {

  const { userId, reqId ,reason } = req.body;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  if (!reason) return res.status(400).json({ error: 'Missing reason' });
  if (!reqId) return res.status(400).json({ error: 'Missing requestId' });

  try {
    const [rows] = await db.query(`UPDATE leave_requests
                                        SET 
                                            status = 'rejected',
                                            current_waiting = NULL,
                                            rejection_reason = ?,
                                            rejected_by = ?
                                        WHERE 
                                            id = ?;`,[reason,userId.id,reqId]);
    
    res.json({ status: 'updated' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;
