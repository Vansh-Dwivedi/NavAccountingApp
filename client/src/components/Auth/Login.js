import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import GoogleOAuthButton from '../GoogleOAuthButton';
import { Divider } from 'antd';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firmId, setFirmId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
        firmId,
      });
      if (response.data.user.isBlocked) {
        setError(
          "Your account has been blocked. Please contact an administrator."
        );
        return;
      }
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        navigateToDashboard(response.data.user.role);
      } else {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        navigateToDashboard(response.data.user.role);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || "An error occurred during login");
    }
  };

  const navigateToDashboard = (role) => {
    let path;
    switch (role) {
      case "admin":
        path = "/admin-dashboard";
        break;
      case "manager":
        path = "/manager-dashboard";
        break;
      case "client":
        path = "/client-dashboard";
        break;
      case "employee":
        path = "/employee-dashboard";
        break;
      case "user":
      default:
        path = "/user-dashboard";
    }
    navigate(path, { replace: true });
    window.location.reload();
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Nav Accounts</h1>
        <img
          src={process.env.REACT_APP_API_URL + "/api/app/utils/app-logo.png"}
          alt="Logo"
          className={styles.authLogo}
        />
        <h2 className={styles.authSubtitle}>LOGIN</h2>
        <p className={styles.authDescription}>
          Enter your credentials below to log in to your account
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.authError}>{error}</div>}
          
          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaEnvelope />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={styles.authInput}
              />
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={styles.authInput}
              />
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaGlobe />
              </div>
              <input
                type="text"
                value={firmId}
                onChange={(e) => setFirmId(e.target.value)}
                placeholder="Firm ID"
                required
                className={styles.authInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.authButton}>
            Login
          </button>
          
          <Divider className={styles.authDivider}>Or</Divider>
          <GoogleOAuthButton mode="login" />
        </form>
        
        <div className={styles.authFooter}>
          Don't have an account?{" "}
          <a href="/register" className={styles.authLink}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
