import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isManager = user?.role === 'manager'

  return (
    <div>
      <nav className="navbar">
        <h1>Employee Attendance System</h1>
        <div className="navbar-nav">
          {isManager ? (
            <>
              <Link to="/manager/dashboard">Dashboard</Link>
              <Link to="/manager/attendance">All Attendance</Link>
              <Link to="/manager/calendar">Calendar</Link>
              <Link to="/manager/reports">Reports</Link>
            </>
          ) : (
            <>
              <Link to="/employee/dashboard">Dashboard</Link>
              <Link to="/employee/attendance">Mark Attendance</Link>
              <Link to="/employee/history">My History</Link>
              <Link to="/employee/profile">Profile</Link>
            </>
          )}
          <span style={{ marginLeft: '20px' }}>{user?.name}</span>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

