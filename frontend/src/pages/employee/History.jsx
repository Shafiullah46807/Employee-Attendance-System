import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyHistory, getMySummary } from '../../store/slices/attendanceSlice'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'

const EmployeeHistory = () => {
  const dispatch = useDispatch()
  const { history, summary, loading } = useSelector((state) => state.attendance)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [view, setView] = useState('calendar') // 'calendar' or 'table'

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }))
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }))
  }, [dispatch, selectedMonth, selectedYear])

  const getStatusClass = (status) => {
    switch (status) {
      case 'present': return 'present'
      case 'absent': return 'absent'
      case 'late': return 'late'
      case 'half-day': return 'half-day'
      default: return ''
    }
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1))
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth - 1))
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    const attendanceMap = {}
    history.forEach(att => {
      const dateKey = format(new Date(att.date), 'yyyy-MM-dd')
      attendanceMap[dateKey] = att
    })

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const firstDayOfWeek = monthStart.getDay()

    return (
      <div>
        <div className="calendar">
          {weekDays.map(day => (
            <div key={day} className="calendar-header">{day}</div>
          ))}
          {Array(firstDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const att = attendanceMap[dateKey]
            const dayClass = att ? getStatusClass(att.status) : ''
            
            return (
              <div
                key={dateKey}
                className={`calendar-day ${dayClass}`}
                title={att ? `Status: ${att.status}` : 'No attendance'}
              >
                <div>{format(day, 'd')}</div>
                {att && (
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {att.checkInTime && format(new Date(att.checkInTime), 'HH:mm')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ padding: '5px 10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>Present</div>
          <div style={{ padding: '5px 10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>Absent</div>
          <div style={{ padding: '5px 10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>Late</div>
          <div style={{ padding: '5px 10px', backgroundColor: '#ffeaa7', borderRadius: '4px' }}>Half Day</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>My Attendance History</h2>

      {/* Filters */}
      <div className="card">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {format(new Date(selectedYear, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '25px' }}>
            <button
              className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('calendar')}
            >
              Calendar
            </button>
            <button
              className={`btn ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('table')}
              style={{ marginLeft: '10px' }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Present</h3>
            <div className="stat-value">{summary.present}</div>
          </div>
          <div className="stat-card">
            <h3>Absent</h3>
            <div className="stat-value">{summary.absent}</div>
          </div>
          <div className="stat-card">
            <h3>Late</h3>
            <div className="stat-value">{summary.late}</div>
          </div>
          <div className="stat-card">
            <h3>Total Hours</h3>
            <div className="stat-value">{summary.totalHours.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* Calendar or Table View */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : view === 'calendar' ? (
        <div className="card">
          <h3>{format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}</h3>
          {renderCalendar()}
        </div>
      ) : (
        <div className="card">
          <h3>Attendance Table</h3>
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
              {history.length > 0 ? (
                history.map((att) => (
                  <tr key={att._id}>
                    <td>{format(new Date(att.date), 'PP')}</td>
                    <td>{att.checkInTime ? format(new Date(att.checkInTime), 'PPpp') : 'N/A'}</td>
                    <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'PPpp') : 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{att.totalHours || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EmployeeHistory

