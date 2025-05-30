const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    const rows = await userRepo.findOneBy({ email, password });

    if (!rows) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ user: { id: rows.id, email: rows.email ,isAdmin: rows.isAdmin} });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
