const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seedUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'employee',
    department: 'Marketing'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'employee',
    department: 'Sales'
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
    department: 'Management'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.employeeId || 'Manager'})`);
    }

    // Create sample attendance records for employees
    const employees = createdUsers.filter(u => u.role === 'employee');
    const today = new Date();

    for (const employee of employees) {
      // Create attendance for last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Skip weekends (Saturday = 6, Sunday = 0)
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }

        // Random attendance (80% present, 15% late, 5% absent)
        const rand = Math.random();
        let status = 'absent';
        let checkInTime = null;
        let checkOutTime = null;

        if (rand < 0.80) {
          // Present
          status = 'present';
          checkInTime = new Date(date);
          checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);

          checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
        } else if (rand < 0.95) {
          // Late
          status = 'late';
          checkInTime = new Date(date);
          checkInTime.setHours(9 + Math.floor(Math.random() * 3), 15 + Math.floor(Math.random() * 45), 0);

          checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
        }

        const attendance = new Attendance({
          userId: employee._id,
          date: date,
          checkInTime: checkInTime,
          checkOutTime: checkOutTime,
          status: status
        });

        if (checkInTime && checkOutTime) {
          attendance.calculateHours();
        }

        await attendance.save();
      }
    }

    console.log('Created sample attendance records');
    console.log('\nSeed data created successfully!');
    console.log('\nSample login credentials:');
    console.log('Employee: john@example.com / password123');
    console.log('Manager: manager@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

