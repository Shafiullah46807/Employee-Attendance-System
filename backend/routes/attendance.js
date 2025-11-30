const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { authMiddleware, managerOnly } = require('../middleware/auth');

const router = express.Router();

// Helper function to get start and end of day
const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// Helper function to determine status based on check-in time
const determineStatus = (checkInTime) => {
  if (!checkInTime) return 'absent';
  const checkInHour = checkInTime.getHours();
  const checkInMinute = checkInTime.getMinutes();
  
  // Assuming 9 AM is the standard time (can be configured)
  if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 15)) {
    return 'late';
  }
  return 'present';
};

// @route   POST /api/attendance/checkin
// @desc    Employee check in
// @access  Private (Employee)
router.post('/checkin', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    const checkInTime = new Date();

    if (attendance) {
      // Already checked in
      if (attendance.checkInTime) {
        return res.status(400).json({ message: 'Already checked in today' });
      }
      attendance.checkInTime = checkInTime;
      attendance.status = determineStatus(checkInTime);
    } else {
      // Create new attendance record
      attendance = new Attendance({
        userId: req.user._id,
        date: today,
        checkInTime: checkInTime,
        status: determineStatus(checkInTime)
      });
    }

    await attendance.save();

    res.json({
      message: 'Checked in successfully',
      attendance: {
        id: attendance._id,
        checkInTime: attendance.checkInTime,
        status: attendance.status,
        date: attendance.date
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error during check-in' });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Employee check out
// @access  Private (Employee)
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (!attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOutTime = new Date();
    attendance.calculateHours();

    await attendance.save();

    res.json({
      message: 'Checked out successfully',
      attendance: {
        id: attendance._id,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        totalHours: attendance.totalHours,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Server error during check-out' });
  }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
// @access  Private (Employee)
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        status: 'not_checked_in'
      });
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      totalHours: attendance.totalHours,
      status: attendance.status
    });
  } catch (error) {
    console.error('Get today error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/my-history
// @desc    Get employee's attendance history
// @access  Private (Employee)
router.get('/my-history', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/my-summary
// @desc    Get monthly summary for employee
// @access  Private (Employee)
router.get('/my-summary', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
      totalDays: 0
    };

    attendance.forEach(record => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;

      if (record.totalHours) {
        summary.totalHours += parseFloat(record.totalHours);
      }
    });

    summary.totalDays = attendance.length;

    res.json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/all
// @desc    Get all employees attendance (Manager)
// @access  Private (Manager)
router.get('/all', authMiddleware, managerOnly, async (req, res) => {
  try {
    const { employeeId, startDate, endDate, status } = req.query;
    const query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(500);

    res.json(attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/employee/:id
// @desc    Get specific employee attendance (Manager)
// @access  Private (Manager)
router.get('/employee/:id', authMiddleware, managerOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query = { userId: id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get employee attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/summary
// @desc    Get team attendance summary (Manager)
// @access  Private (Manager)
router.get('/summary', authMiddleware, managerOnly, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name employeeId department');

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalEmployees: 0,
      departmentWise: {}
    };

    const employeeSet = new Set();

    attendance.forEach(record => {
      employeeSet.add(record.userId._id.toString());
      
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;

      const dept = record.userId.department || 'General';
      if (!summary.departmentWise[dept]) {
        summary.departmentWise[dept] = { present: 0, absent: 0, late: 0 };
      }
      summary.departmentWise[dept][record.status] = 
        (summary.departmentWise[dept][record.status] || 0) + 1;
    });

    summary.totalEmployees = employeeSet.size;

    res.json(summary);
  } catch (error) {
    console.error('Get team summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/today-status
// @desc    Get today's attendance status for all employees (Manager)
// @access  Private (Manager)
router.get('/today-status', authMiddleware, managerOnly, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);

    const attendance = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name email employeeId department');

    const present = attendance.filter(a => a.checkInTime).length;
    const allEmployees = await User.countDocuments({ role: 'employee' });
    const absent = allEmployees - present;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({
      present,
      absent,
      late,
      total: allEmployees,
      attendance: attendance.map(a => ({
        user: a.userId,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status
      }))
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/export
// @desc    Export attendance to CSV (Manager)
// @access  Private (Manager)
router.get('/export', authMiddleware, managerOnly, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    const csvData = attendance.map(a => ({
      'Employee ID': a.userId.employeeId,
      'Name': a.userId.name,
      'Email': a.userId.email,
      'Department': a.userId.department,
      'Date': a.date.toISOString().split('T')[0],
      'Check In': a.checkInTime ? a.checkInTime.toISOString() : 'N/A',
      'Check Out': a.checkOutTime ? a.checkOutTime.toISOString() : 'N/A',
      'Status': a.status,
      'Total Hours': a.totalHours || 0
    }));

    // Convert to CSV format
    if (csvData.length === 0) {
      return res.status(400).json({ message: 'No data to export' });
    }

    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ];
    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${Date.now()}.csv`);
    res.send(csvString);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error during export' });
  }
});

module.exports = router;

