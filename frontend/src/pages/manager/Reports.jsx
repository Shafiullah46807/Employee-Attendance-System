import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttendance, exportAttendance } from '../../store/slices/attendanceSlice'
import { format } from 'date-fns'

const ManagerReports = () => {
  const dispatch = useDispatch()
  const { allAttendance, loading } = useSelector((state) => state.attendance)
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: ''
  })

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = () => {
    dispatch(getAllAttendance(filters))
  }

  const handleExport = () => {
    dispatch(exportAttendance(filters))
  }

  const handleReset = () => {
    setFilters({ employeeId: '', startDate: '', endDate: '' })
    dispatch(getAllAttendance({}))
  }

  useEffect(() => {
    // Load initial data with current month
    const today = new Date()
    const startDate = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd')
    const endDate = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd')
    dispatch(getAllAttendance({ startDate, endDate }))
  }, [dispatch])

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
      <h2>Attendance Reports</h2>

      {/* Filters */}
      <div className="card">
        <h3>Report Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Employee ID (Leave empty for all)</label>
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
        </div>
        <div style={{ marginTop: '15px' }}>
          <button className="btn btn-primary" onClick={handleFilter}>Generate Report</button>
          <button className="btn btn-success" onClick={handleExport} style={{ marginLeft: '10px' }}>
            Export to CSV
          </button>
          <button className="btn btn-secondary" onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
        </div>
      </div>

      {/* Report Table */}
      <div className="card">
        <h3>Attendance Report</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {allAttendance.length > 0 && (
              <p style={{ marginBottom: '15px' }}>
                Total Records: <strong>{allAttendance.length}</strong>
              </p>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {allAttendance.length > 0 ? (
                  allAttendance.map((att) => (
                    <tr key={att._id}>
                      <td>{att.userId?.employeeId}</td>
                      <td>{att.userId?.name}</td>
                      <td>{att.userId?.email}</td>
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
                    <td colSpan="9" style={{ textAlign: 'center' }}>No attendance records found. Apply filters to generate report.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

export default ManagerReports

