import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const EmployeeProfile = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div>
      <h2>My Profile</h2>
      <div className="card">
        <h3>Personal Information</h3>
        <table className="table" style={{ maxWidth: '600px' }}>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td><strong>Employee ID</strong></td>
              <td>{user?.employeeId}</td>
            </tr>
            <tr>
              <td><strong>Department</strong></td>
              <td>{user?.department}</td>
            </tr>
            <tr>
              <td><strong>Role</strong></td>
              <td>
                <span className="badge badge-info">{user?.role}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeProfile

