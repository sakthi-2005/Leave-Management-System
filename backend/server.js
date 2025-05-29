const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Import route files
const authRoutes = require('./routes/auth');
const leaveBalanceRoutes = require('./routes/leaveBalance');
const leaveRequestsRoutes = require('./routes/leaveRequests');

const db = require('./db');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database Schema Execution
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
app.use('/api/leave', leaveRequestsRoutes);

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
