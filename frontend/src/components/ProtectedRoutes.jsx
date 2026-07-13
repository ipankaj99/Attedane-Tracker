import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Prevent "flicker"

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}