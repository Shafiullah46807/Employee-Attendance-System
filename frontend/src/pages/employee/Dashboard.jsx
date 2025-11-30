import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getEmployeeDashboard } from '../../store/slices/dashboardSlice'
import { checkIn, checkOut, getTodayStatus } from '../../store/slices/attendanceSlice'
import { format } from 'date-fns'

const EmployeeDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { employeeData, loading } = useSelector((state) => state.dashboard)
  const { todayStatus } = useSelector((state) => state.attendance)

  useEffect(() => {
    dispatch(getEmployeeDashboard())
    dispatch(getTodayStatus())
  }, [dispatch])

  const handleCheckIn = () => {
    dispatch(checkIn()).then(() => {
      dispatch(getTodayStatus())
      dispatch(getEmployeeDashboard())
    })
  }

  const handleCheckOut = () => {
    dispatch(checkOut()).then(() => {
      dispatch(getTodayStatus())
      dispatch(getEmployeeDashboard())
    })
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h2>Employee Dashboard</h2>

      {/* Today's Status Card */}
      <div className="card">
        <h3>Today's Status</h3>
        {todayStatus?.checkedIn ? (
          <div>
            <p><strong>Status:</strong> 
              <span className={`badge badge-${todayStatus.status === 'present' ? 'success' : 'warning'}`} style={{ marginLeft: '10px' }}>
                {todayStatus.status === 'present' ? 'Present' : 'Late'}
              </span>
            </p>
            <p><strong>Check In:</strong> {todayStatus.checkInTime ? format(new Date(todayStatus.checkInTime), 'PPpp') : 'N/A'}</p>
            {todayStatus.checkOutTime ? (
              <p><strong>Check Out:</strong> {format(new Date(todayStatus.checkOutTime), 'PPpp')}</p>
            ) : (
              <button className="btn btn-danger" onClick={handleCheckOut} style={{ marginTop: '10px' }}>
                Check Out
              </button>
            )}
            {todayStatus.totalHours && (
              <p><strong>Total Hours:</strong> {todayStatus.totalHours} hours</p>
            )}
          </div>
        ) : (
          <div>
            <p><strong>Status:</strong> <span className="badge badge-danger">Not Checked In</span></p>
            <button className="btn btn-success" onClick={handleCheckIn} style={{ marginTop: '10px' }}>
              Check In
            </button>
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      {employeeData?.monthlySummary && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Present Days</h3>
            <div className="stat-value">{employeeData.monthlySummary.present}</div>
          </div>
          <div className="stat-card">
            <h3>Absent Days</h3>
            <div className="stat-value">{employeeData.monthlySummary.absent}</div>
          </div>
          <div className="stat-card">
            <h3>Late Days</h3>
            <div className="stat-value">{employeeData.monthlySummary.late}</div>
          </div>
          <div className="stat-card">
            <h3>Total Hours</h3>
            <div className="stat-value">{employeeData.monthlySummary.totalHours.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      {employeeData?.recentAttendance && employeeData.recentAttendance.length > 0 && (
        <div className="card">
          <h3>Recent Attendance (Last 7 Days)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.recentAttendance.map((att, idx) => (
                <tr key={idx}>
                  <td>{format(new Date(att.date), 'PP')}</td>
                  <td>{att.checkInTime ? format(new Date(att.checkInTime), 'p') : 'N/A'}</td>
                  <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'p') : 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                      {att.status}
                    </span>
                  </td>
                  <td>{att.totalHours || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard

