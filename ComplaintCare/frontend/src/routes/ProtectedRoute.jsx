import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

// Ensures the user is authenticated before rendering nested routes.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
