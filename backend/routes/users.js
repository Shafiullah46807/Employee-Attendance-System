const express = require('express');
const User = require('../models/User');
const { authMiddleware, managerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all employees (Manager)
// @access  Private (Manager)
router.get('/', authMiddleware, managerOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

