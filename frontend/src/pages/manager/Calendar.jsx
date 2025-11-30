import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAttendance } from '../../store/slices/attendanceSlice'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'

const ManagerCalendar = () => {
  const dispatch = useDispatch()
  const { allAttendance, loading } = useSelector((state) => state.attendance)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1)
    const endDate = endOfMonth(startDate)
    dispatch(getAllAttendance({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    }))
  }, [dispatch, selectedMonth, selectedYear])

  const renderCalendar = () => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1))
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth - 1))
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    // Group attendance by date
    const attendanceByDate = {}
    allAttendance.forEach(att => {
      const dateKey = format(new Date(att.date), 'yyyy-MM-dd')
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = { present: 0, absent: 0, late: 0, total: 0 }
      }
      if (att.status === 'present') attendanceByDate[dateKey].present++
      else if (att.status === 'absent') attendanceByDate[dateKey].absent++
      else if (att.status === 'late') attendanceByDate[dateKey].late++
      attendanceByDate[dateKey].total++
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
            const stats = attendanceByDate[dateKey]
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            
            return (
              <div
                key={dateKey}
                className={`calendar-day ${isSelected ? 'present' : ''}`}
                onClick={() => setSelectedDate(day)}
                style={{ cursor: 'pointer' }}
              >
                <div>{format(day, 'd')}</div>
                {stats && (
                  <div style={{ fontSize: '10px', marginTop: '5px' }}>
                    <div>P: {stats.present}</div>
                    <div>A: {stats.absent}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const getDateDetails = () => {
    if (!selectedDate) return null
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    return allAttendance.filter(att => 
      format(new Date(att.date), 'yyyy-MM-dd') === dateKey
    )
  }

  const dateDetails = getDateDetails()

  return (
    <div>
      <h2>Team Calendar View</h2>

      {/* Month/Year Selector */}
      <div className="card">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
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
        </div>
      </div>

      {/* Calendar */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card">
          <h3>{format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Click on a date to see details. P = Present, A = Absent
          </p>
          {renderCalendar()}
        </div>
      )}

      {/* Date Details */}
      {selectedDate && dateDetails && (
        <div className="card">
          <h3>Attendance Details for {format(selectedDate, 'PP')}</h3>
          {dateDetails.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dateDetails.map((att) => (
                  <tr key={att._id}>
                    <td>{att.userId?.employeeId}</td>
                    <td>{att.userId?.name}</td>
                    <td>{att.userId?.department}</td>
                    <td>{att.checkInTime ? format(new Date(att.checkInTime), 'p') : 'N/A'}</td>
                    <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'p') : 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendance records for this date.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ManagerCalendar

