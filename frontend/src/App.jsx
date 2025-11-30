import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/employee/Dashboard'
import EmployeeAttendance from './pages/employee/Attendance'
import EmployeeHistory from './pages/employee/History'
import EmployeeProfile from './pages/employee/Profile'
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerAttendance from './pages/manager/Attendance'
import ManagerCalendar from './pages/manager/Calendar'
import ManagerReports from './pages/manager/Reports'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/employee/dashboard" /> : <Register />} />
      
      <Route path="/employee" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />
        <Route path="attendance" element={<PrivateRoute role="employee"><EmployeeAttendance /></PrivateRoute>} />
        <Route path="history" element={<PrivateRoute role="employee"><EmployeeHistory /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute role="employee"><EmployeeProfile /></PrivateRoute>} />
      </Route>

      <Route path="/manager" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<PrivateRoute role="manager"><ManagerDashboard /></PrivateRoute>} />
        <Route path="attendance" element={<PrivateRoute role="manager"><ManagerAttendance /></PrivateRoute>} />
        <Route path="calendar" element={<PrivateRoute role="manager"><ManagerCalendar /></PrivateRoute>} />
        <Route path="reports" element={<PrivateRoute role="manager"><ManagerReports /></PrivateRoute>} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard') : '/login'} />} />
    </Routes>
  )
}

export default App

