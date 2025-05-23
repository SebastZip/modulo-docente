import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('usuarioLogueado') === 'true';
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};