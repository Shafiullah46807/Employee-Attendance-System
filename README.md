# Employee Attendance System

A comprehensive attendance tracking system built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## 📸 Screenshots

### Login & Registration
![Login Page]("C:\Users\ameer\OneDrive\Pictures\Screenshots\Screenshot 2025-11-30 083434.png")
*Modern login page with gradient background*

![Registration Page](./screenshots/register.png)
*User registration form*

### Employee Pages
![Employee Dashboard](./screenshots/employee-dashboard.png)
*Employee dashboard showing today's status and monthly summary*

![Mark Attendance](./screenshots/employee-attendance.png)
*Check In/Check Out interface*

![Attendance History](./screenshots/employee-history.png)
*Attendance history with calendar and table views*

![Employee Profile](./screenshots/employee-profile.png)
*Employee profile information*

### Manager Pages
![Manager Dashboard](./screenshots/manager-dashboard.png)
*Manager dashboard with team statistics and charts*

![All Attendance](./screenshots/manager-attendance.png)
*View all employees' attendance with filters*

![Team Calendar](./screenshots/manager-calendar.png)
*Team calendar view showing attendance overview*

![Reports](./screenshots/manager-reports.png)
*Attendance reports with CSV export functionality*

## Features

### Employee Features
- Register/Login
- Mark attendance (Check In / Check Out)
- View attendance history (Calendar and Table views)
- View monthly summary (Present/Absent/Late days)
- Dashboard with statistics

### Manager Features
- Login
- View all employees' attendance
- Filter by employee, date, status
- View team attendance summary
- Export attendance reports (CSV)
- Dashboard with team statistics and charts
- Team calendar view

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models (User, Attendance)
│   ├── routes/          # API routes (auth, attendance, dashboard)
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Seed data script
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components (employee & manager)
│   │   ├── store/       # Redux store and slices
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-attendance-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service, it should auto-start)
# Or manually:
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 5. Seed Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 3 sample employees (john@example.com, jane@example.com, bob@example.com)
- 1 manager (manager@example.com)
- Sample attendance records for the last 30 days

All passwords: `password123`

### 6. Run the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/my-history` - Get attendance history
- `GET /api/attendance/my-summary` - Get monthly summary

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees' attendance
- `GET /api/attendance/employee/:id` - Get specific employee's attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/today-status` - Get today's attendance status
- `GET /api/attendance/export` - Export CSV

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'employee' | 'manager',
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Model
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: 'present' | 'absent' | 'late' | 'half-day',
  totalHours: Number,
  createdAt: Date
}
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Default Login Credentials (After Seeding)

### Employee
- Email: `john@example.com`
- Password: `password123`

- Email: `jane@example.com`
- Password: `password123`

- Email: `bob@example.com`
- Password: `password123`

### Manager
- Email: `manager@example.com`
- Password: `password123`

## 📸 How to Add Screenshots

### Step 1: Take Screenshots
1. Run your application (`npm run dev` in both backend and frontend)
2. Navigate through the application
3. Take screenshots of key pages:
   - Login page
   - Registration page
   - Employee dashboard
   - Employee attendance page
   - Employee history page
   - Employee profile
   - Manager dashboard
   - Manager attendance view
   - Manager calendar
   - Manager reports

### Step 2: Save Screenshots
1. Create a `screenshots` folder in the project root (if not exists)
2. Save screenshots with these names:
   - `login.png`
   - `register.png`
   - `employee-dashboard.png`
   - `employee-attendance.png`
   - `employee-history.png`
   - `employee-profile.png`
   - `manager-dashboard.png`
   - `manager-attendance.png`
   - `manager-calendar.png`
   - `manager-reports.png`

### Step 3: Add to README
The screenshots section is already added above. The images will automatically display when you add the files.

**Alternative: Use GitHub's Image Upload**
1. Go to your GitHub repository
2. Navigate to the `screenshots` folder
3. Click "Add file" → "Upload files"
4. Drag and drop your screenshots
5. GitHub will give you the path automatically

**Alternative: Use External Image Hosting**
You can also use services like:
- [Imgur](https://imgur.com/)
- [Cloudinary](https://cloudinary.com/)
- [GitHub Issues](https://github.com) (upload to issue comments)

Then replace the image paths in README with the hosted URLs.

## Features Walkthrough

### Employee Flow
1. Register/Login as employee
2. View dashboard with today's status and monthly summary
3. Check in/Check out from attendance page
4. View attendance history in calendar or table format
5. View profile information

### Manager Flow
1. Login as manager
2. View dashboard with team statistics and charts
3. View all employees' attendance with filters
4. View team calendar with attendance overview
5. Generate and export attendance reports to CSV

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Protected routes require valid authentication
- Manager-only routes check for manager role
- Change JWT_SECRET in production

## Future Enhancements

- Email notifications for attendance reminders
- Leave management system
- Overtime tracking
- Mobile app support
- Biometric integration
- Advanced reporting with PDF export
- Department-wise analytics
- Shift management

## License

ISC

## Author

Employee Attendance System

