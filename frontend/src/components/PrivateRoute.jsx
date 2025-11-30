import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} />
  }

  return children
}

export default PrivateRoute

