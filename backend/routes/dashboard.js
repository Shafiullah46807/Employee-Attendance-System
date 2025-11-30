const express = require('express');
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

// Helper function to get date range for week
const getWeekRange = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard stats
// @access  Private (Employee)
router.get('/employee', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    // Monthly summary
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const monthlyAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const monthlySummary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    monthlyAttendance.forEach(record => {
      if (record.status === 'present') monthlySummary.present++;
      else if (record.status === 'absent') monthlySummary.absent++;
      else if (record.status === 'late') monthlySummary.late++;
      else if (record.status === 'half-day') monthlySummary.halfDay++;

      if (record.totalHours) {
        monthlySummary.totalHours += parseFloat(record.totalHours);
      }
    });

    // Recent attendance (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo, $lte: end }
    })
    .sort({ date: -1 })
    .limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'not_checked_in'
      },
      monthlySummary,
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status,
        totalHours: a.totalHours
      }))
    });
  } catch (error) {
    console.error('Employee dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager dashboard stats
// @access  Private (Manager)
router.get('/manager', authMiddleware, managerOnly, async (req, res) => {
  try {
    const today = new Date();
    const { start, end } = getDayRange(today);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name employeeId department');

    const presentToday = todayAttendance.filter(a => a.checkInTime).length;
    const absentToday = totalEmployees - presentToday;
    const lateToday = todayAttendance.filter(a => a.status === 'late').length;
    const absentEmployees = await User.find({ role: 'employee' })
      .select('name email employeeId department');

    const absentEmployeeIds = new Set(
      todayAttendance.filter(a => a.checkInTime).map(a => a.userId._id.toString())
    );

    const absentList = absentEmployees.filter(emp => !absentEmployeeIds.has(emp._id.toString()));

    // Weekly attendance trend (last 7 days)
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const { start: dayStart, end: dayEnd } = getDayRange(date);

      const dayAttendance = await Attendance.find({
        date: { $gte: dayStart, $lte: dayEnd }
      });

      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        present: dayAttendance.filter(a => a.checkInTime).length,
        absent: totalEmployees - dayAttendance.filter(a => a.checkInTime).length,
        late: dayAttendance.filter(a => a.status === 'late').length
      });
    }

    // Department-wise attendance
    const allEmployees = await User.find({ role: 'employee' }).select('department');
    const departmentStats = {};

    allEmployees.forEach(emp => {
      const dept = emp.department || 'General';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, present: 0, absent: 0 };
      }
      departmentStats[dept].total++;
    });

    todayAttendance.forEach(att => {
      if (att.checkInTime) {
        const dept = att.userId.department || 'General';
        if (departmentStats[dept]) {
          departmentStats[dept].present++;
        }
      }
    });

    Object.keys(departmentStats).forEach(dept => {
      departmentStats[dept].absent = departmentStats[dept].total - departmentStats[dept].present;
    });

    res.json({
      totalEmployees,
      todayAttendance: {
        present: presentToday,
        absent: absentToday,
        late: lateToday
      },
      absentEmployees: absentList.map(emp => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        employeeId: emp.employeeId,
        department: emp.department
      })),
      weeklyTrend,
      departmentWise: departmentStats
    });
  } catch (error) {
    console.error('Manager dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

