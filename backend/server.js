const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure MongoDB is installed and running');
  console.log('2. Check if MongoDB service is started');
  console.log('3. Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env');
  console.log('4. For Windows: Start MongoDB service or run: mongod');
  console.log('\n📝 To use MongoDB Atlas (free cloud database):');
  console.log('   - Go to https://www.mongodb.com/cloud/atlas');
  console.log('   - Create a free cluster');
  console.log('   - Get connection string and add to .env file');
  process.exit(1);
});

module.exports = app;

