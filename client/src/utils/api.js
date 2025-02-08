import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token in interceptor:', token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request config:', config);
  return config;
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const updateDashboardComponents = (userId, component, enabled) => {
  return api.put(`/api/users/${userId}/dashboard-components`, {
    component,
    enabled
  });
};

export default api;
export {
  updateDashboardComponents
};