import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};
