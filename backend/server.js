const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const leaveBalanceRoutes = require('./routes/leaveBalance');
const reportees = require('./routes/reportees');
const holidays = require('./routes/holidays');
const requestleave = require('./routes/request');
const pendingRequest = require('./routes/pendingrequest');
const calenderLeave = require('./routes/calendarLeaves');
const history = require('./routes/history');
const acceptRequest = require('./routes/acceptRequest');
const rejectRequest = require('./routes/rejectRequest');
const addUser = require('./routes/addUser');
const addLeave = require('./routes/addLeave');
const allUser = require('./routes/allUsers');
const allLeave = require('./routes/allLeaves');
const userDetails = require('./routes/userDetails');
const updateUser = require('./routes/updateUser');
const updateLeave = require('./routes/updateLeave');
const cancelRequest = require('./routes/cancelRequest');
const deleteLeave = require('./routes/deleteLeave');
const deleteuser = require('./routes/deleteUser');

const {initializeDatabase} = require('./db');
initializeDatabase();

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// // Database Schema Execution
// const executeSchema = async () => {
//   try {
//     const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
//     const queries = schema.split(';').filter(q => q.trim());

//     for (let query of queries) {
//       await db.query(query);
//     }

//     console.log('Database schema created or verified successfully.');
//   } catch (err) {
//     console.error('Error executing schema.sql:', err);
//   }
// };

// executeSchema();

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
