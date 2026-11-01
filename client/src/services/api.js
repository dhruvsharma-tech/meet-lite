import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().clearUser();
      const currentPath = window.location.pathname;
      // Only redirect to login if the user was inside protected application routes (/app)
      if (currentPath.startsWith('/app')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
