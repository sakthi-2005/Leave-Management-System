const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./route/auth');
const leaveBalanceRoutes = require('./route/leaveBalance');
const reportees = require('./route/reportees');
const holidays = require('./route/holidays');
const requestleave = require('./route/request');
const pendingRequest = require('./route/pendingrequest');
const calenderLeave = require('./route/calendarLeaves');
const history = require('./route/history');
const acceptRequest = require('./route/acceptRequest');
const rejectRequest = require('./route/rejectRequest');
const addUser = require('./route/addUser');
const addLeave = require('./route/addLeave');
const allUser = require('./route/allUsers');
const allLeave = require('./route/allLeaves');
const userDetails = require('./route/userDetails');
const updateUser = require('./route/updateUser');
const updateLeave = require('./route/updateLeave');
const cancelRequest = require('./route/cancelRequest');
const deleteLeave = require('./route/deleteLeave');
const deleteuser = require('./route/deleteUser');

const db = require('./db');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// // Database Schema Execution
const executeSchema = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const queries = schema.split(';').filter(q => q.trim());

    for (let query of queries) {
      await db.query(query);
    }

    console.log('Database schema created or verified successfully.');
  } catch (err) {
    console.error('Error executing schema.sql:', err);
  }
};

executeSchema();

// Routes
app.use('/api', authRoutes);
app.use('/api/leave', leaveBalanceRoutes);
app.use('/api/user',userDetails)
app.use('/api/user',reportees);
app.use('/api/leave',holidays);
app.use('/api/leave',requestleave);
app.use('/api/leave',pendingRequest);
app.use('/api/leave',calenderLeave);
app.use('/api/leave',history);
app.use('/api/leave',acceptRequest);
app.use('/api/leave',rejectRequest);
app.use('/api/leave',cancelRequest);
app.use('/api/admin',addUser);
app.use('/api/admin',addLeave);
app.use('/api/admin',allUser);
app.use('/api/admin',allLeave);
app.use('/api/admin',updateUser);
app.use('/api/admin',updateLeave);
app.use('/api/admin',deleteLeave);
app.use('/api/admin',deleteuser);

// app.use('')

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
