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
      const currentPath = window.location.pathname;
      // Do not redirect if user is already attempting login or registration
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        useAuthStore.getState().clearUser();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

