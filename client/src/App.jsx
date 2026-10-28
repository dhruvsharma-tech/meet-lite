import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppPage from './pages/AppPage';
import InvitePage from './pages/InvitePage';

export default function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2b2d31',
            color: '#f2f3f5',
            border: '1px solid #1e1f22',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#23a55a',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f23f42',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/:serverId"
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/:serverId/:channelId"
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          }
        />

        {/* Invite Page (public but redirects to login if unauthenticated) */}
        <Route path="/invite/:code" element={<InvitePage />} />

        {/* Root Redirects to /app (which redirects to /login if unauthenticated) */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
