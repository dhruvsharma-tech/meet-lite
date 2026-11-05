import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import SpaceLoadingScreen from '../common/SpaceLoadingScreen';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <SpaceLoadingScreen message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
