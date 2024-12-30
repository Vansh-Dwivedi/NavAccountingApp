import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.error);
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Nav Accounts</h1>
        <img
          src={process.env.REACT_APP_API_URL + "/api/app/utils/app-logo.png"}
          alt="Logo"
          className="auth-logo"
        />
        <h2 className="auth-subtitle">Forgot Password</h2>
        <p className="auth-description">
          Enter your email address and we'll send you a link to reset your password
        </p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <div className="auth-input-row">
              <div className="auth-input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="auth-input"
              />
            </div>
          </div>

          <button type="submit" className="auth-button">
            Reset Password
          </button>
        </form>

        <div className="auth-footer">
          Remember your password?{" "}
          <a href="/login" className="auth-link">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;