const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if(rows.isAdmin){
      res.json({ user: { id: rows[0].id, email: rows[0].email, role: rows[0].role , isAdmin: rows[0].isAdmin} })
    }

    res.json({ user: { id: rows[0].id, email: rows[0].email, role: rows[0].role ,isAdmin: rows[0].isAdmin} });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
