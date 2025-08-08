// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem('token');

  // التحقق من وجود التوكن
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // التحقق من المصادقة
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // التحقق من الدور إن تم تحديده
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'superadmin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
