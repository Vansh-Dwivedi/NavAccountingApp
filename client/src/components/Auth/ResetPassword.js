import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import api from '../../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await api.post(`/auth/reset-password/${resetToken}`, { password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
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
        <h2 className="auth-subtitle">Reset Password</h2>
        <p className="auth-description">
          Enter your new password below
        </p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <div className="auth-input-row">
              <div className="auth-input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="auth-input-row">
              <div className="auth-input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
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

export default ResetPassword;