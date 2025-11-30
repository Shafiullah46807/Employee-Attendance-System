import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttendance, getTodayStatusAll } from '../../store/slices/attendanceSlice'
import { format } from 'date-fns'

const ManagerAttendance = () => {
  const dispatch = useDispatch()
  const { allAttendance, todayStatus, loading } = useSelector((state) => state.attendance)
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: ''
  })

  useEffect(() => {
    dispatch(getTodayStatusAll())
    dispatch(getAllAttendance({}))
  }, [dispatch])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = () => {
    dispatch(getAllAttendance(filters))
  }

  const handleReset = () => {
    setFilters({ employeeId: '', startDate: '', endDate: '', status: '' })
    dispatch(getAllAttendance({}))
  }

  const getStatusBadge = (status) => {
    const badgeClass = {
      present: 'badge-success',
      absent: 'badge-danger',
      late: 'badge-warning',
      'half-day': 'badge-info'
    }[status] || 'badge-secondary'
    
    return <span className={`badge ${badgeClass}`}>{status}</span>
  }

  return (
    <div>
      <h2>All Employees Attendance</h2>

      {/* Filters */}
      <div className="card">
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="EMP001"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <button className="btn btn-primary" onClick={handleFilter}>Apply Filters</button>
          <button className="btn btn-secondary" onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
        </div>
      </div>

      {/* Today's Status */}
      {todayStatus && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <div className="stat-value">{todayStatus.total || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Present</h3>
            <div className="stat-value">{todayStatus.present || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Absent</h3>
            <div className="stat-value">{todayStatus.absent || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Late</h3>
            <div className="stat-value">{todayStatus.late || 0}</div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card">
        <h3>Attendance Records</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {allAttendance.length > 0 ? (
                allAttendance.map((att) => (
                  <tr key={att._id}>
                    <td>{att.userId?.employeeId}</td>
                    <td>{att.userId?.name}</td>
                    <td>{att.userId?.department}</td>
                    <td>{format(new Date(att.date), 'PP')}</td>
                    <td>{att.checkInTime ? format(new Date(att.checkInTime), 'PPpp') : 'N/A'}</td>
                    <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'PPpp') : 'N/A'}</td>
                    <td>{getStatusBadge(att.status)}</td>
                    <td>{att.totalHours || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ManagerAttendance

