import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTodayStatus, checkIn, checkOut } from '../../store/slices/attendanceSlice'
import { format } from 'date-fns'

const EmployeeAttendance = () => {
  const dispatch = useDispatch()
  const { todayStatus, loading, error } = useSelector((state) => state.attendance)

  useEffect(() => {
    dispatch(getTodayStatus())
  }, [dispatch])

  const handleCheckIn = () => {
    dispatch(checkIn()).then(() => {
      dispatch(getTodayStatus())
    })
  }

  const handleCheckOut = () => {
    dispatch(checkOut()).then(() => {
      dispatch(getTodayStatus())
    })
  }

  return (
    <div>
      <h2>Mark Attendance</h2>
      <div className="card">
        <h3>Today: {format(new Date(), 'PP')}</h3>
        {error && <div className="error">{error}</div>}
        
        {loading ? (
          <div className="loading">Processing...</div>
        ) : (
          <div>
            {todayStatus?.checkedIn ? (
              <div>
                <p><strong>Check In Time:</strong> {todayStatus.checkInTime ? format(new Date(todayStatus.checkInTime), 'PPpp') : 'N/A'}</p>
                <p><strong>Status:</strong> 
                  <span className={`badge badge-${todayStatus.status === 'present' ? 'success' : 'warning'}`} style={{ marginLeft: '10px' }}>
                    {todayStatus.status === 'present' ? 'Present' : todayStatus.status === 'late' ? 'Late' : todayStatus.status}
                  </span>
                </p>
                
                {todayStatus.checkedOut ? (
                  <div>
                    <p><strong>Check Out Time:</strong> {todayStatus.checkOutTime ? format(new Date(todayStatus.checkOutTime), 'PPpp') : 'N/A'}</p>
                    <p><strong>Total Hours:</strong> {todayStatus.totalHours || 0} hours</p>
                    <p className="success">You have completed your attendance for today.</p>
                  </div>
                ) : (
                  <div>
                    <button className="btn btn-danger" onClick={handleCheckOut} style={{ marginTop: '20px' }}>
                      Check Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>You haven't checked in yet today.</p>
                <button className="btn btn-success" onClick={handleCheckIn} style={{ marginTop: '20px' }}>
                  Check In Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeAttendance

