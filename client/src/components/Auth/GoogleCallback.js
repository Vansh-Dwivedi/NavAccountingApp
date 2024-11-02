import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { message, Spin, Typography } from 'antd';

const { Title } = Typography;

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store the token and update auth context
      localStorage.setItem('token', token);
      login(token);
      
      message.success('Successfully logged in with Google!');
      navigate('/client-dashboard'); // Redirect to dashboard
    } else {
      message.error('Failed to authenticate with Google');
      navigate('/login'); // Redirect back to login on error
    }
  }, [location, navigate, login]);

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: 24 }}>Processing Google Login...</Title>
        <Spin size="large" />
      </div>
    </div>
  );
};

export default GoogleCallback;
