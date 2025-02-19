import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:8443',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Request URL:', config.url);
  console.log('Token in interceptor:', token);
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers['Authorization']);
  } else {
    console.log('No token found in localStorage');
  }
  
  console.log('Final request headers:', config.headers);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized response
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
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