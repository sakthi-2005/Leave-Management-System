const express = require('express');
const db = require('../db');
const router = express.Router();

router.delete('/deleteUser', async (req, res) => {

  const userId = req.query.Id;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    await db.query(`DELETE FROM users WHERE id = ?`,[userId]);
    
    res.json({ status: 'deleted' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

module.exports = router;
