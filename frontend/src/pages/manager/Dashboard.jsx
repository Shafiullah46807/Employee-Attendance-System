import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getManagerDashboard } from '../../store/slices/dashboardSlice'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ManagerDashboard = () => {
  const dispatch = useDispatch()
  const { managerData, loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(getManagerDashboard())
  }, [dispatch])

  if (loading) return <div className="loading">Loading...</div>

  const departmentData = managerData?.departmentWise ? 
    Object.entries(managerData.departmentWise).map(([dept, stats]) => ({
      name: dept,
      present: stats.present,
      absent: stats.absent
    })) : []

  return (
    <div>
      <h2>Manager Dashboard</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-value">{managerData?.totalEmployees || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Present Today</h3>
          <div className="stat-value">{managerData?.todayAttendance?.present || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Absent Today</h3>
          <div className="stat-value">{managerData?.todayAttendance?.absent || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Late Arrivals</h3>
          <div className="stat-value">{managerData?.todayAttendance?.late || 0}</div>
        </div>
      </div>

      {/* Absent Employees Today */}
      {managerData?.absentEmployees && managerData.absentEmployees.length > 0 && (
        <div className="card">
          <h3>Absent Employees Today</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {managerData.absentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Weekly Trend Chart */}
      {managerData?.weeklyTrend && managerData.weeklyTrend.length > 0 && (
        <div className="card">
          <h3>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={managerData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#28a745" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#dc3545" name="Absent" />
              <Line type="monotone" dataKey="late" stroke="#ffc107" name="Late" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department-wise Chart */}
      {departmentData.length > 0 && (
        <div className="card">
          <h3>Department-wise Attendance Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#28a745" name="Present" />
              <Bar dataKey="absent" fill="#dc3545" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default ManagerDashboard

