
import axios from 'axios';

const api = axios.create({
  // Use the absolute URL of the backend server.
  // This avoids the need for a proxy in the Vite dev server.
  // The backend's CORS policy is configured to allow this origin.
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
