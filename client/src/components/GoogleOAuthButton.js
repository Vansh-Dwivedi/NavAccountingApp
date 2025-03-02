import React from 'react';
import { Button, message } from 'antd';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './components.css';
import { GoogleLogin } from '@react-oauth/google';

const GoogleOAuthButton = ({ mode }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google', {
        credential: credentialResponse.credential,
        mode: mode // 'login' or 'register'
      });

      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update auth context
      if (auth && typeof auth.setUser === 'function') {
        auth.setUser(user);
      }

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'manager':
          navigate('/manager-dashboard');
          break;
        case 'employee':
          navigate('/employee-dashboard');
          break;
        case 'client':
          navigate('/client-dashboard');
          break;
        default:
          navigate('/');
      }
      
      message.success(`Successfully ${mode === 'login' ? 'signed in' : 'registered'} with Google!`);
      
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'manager':
          navigate('/manager-dashboard');
          break;
        case 'employee':
          navigate('/employee-dashboard');
          break;
        case 'client':
          navigate('/client-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      message.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ marginTop: '16px', textAlign: 'center', margin: '0 auto' }}>
      <div className="custom-google-button" style={{ display: 'inline-block' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            message.error('Google Login Failed');
          }}
          theme="outline"
          type="standard"
          size="large"
          shape="rectangular"
          useOneTap={false}
          text="continue_with"
          logo_alignment="center"
        />
      </div>
    </div>
  );
};

export default GoogleOAuthButton;