import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Ensure the token is set in the headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Auth headers before profile request:', api.defaults.headers);
        
        const response = await api.get('/api/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        // Clear token if it's invalid
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};