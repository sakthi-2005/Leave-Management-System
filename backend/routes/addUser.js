const express = require('express');
const db = require('../db');
const router = express.Router();
const queue = require('../utils/queue')

router.post('/addUser', queue);

module.exports = router;