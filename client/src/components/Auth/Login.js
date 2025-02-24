import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGlobe, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import GoogleOAuthButton from '../GoogleOAuthButton';
import { Divider, Card, Typography, Alert } from 'antd';
import AnimatedGraphic from '../AnimatedGraphic';
import AuthBackground from '../AuthBackground';

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firmId, setFirmId] = useState("");
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [blockDuration, setBlockDuration] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (blockDuration > 0) {
      setBlockDuration(0);
      setError("");
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before trying again.`);
      return;
    }

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
      
      // Store token in localStorage
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      // Set default Authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      console.log('Token stored:', token); // Debug log
      console.log('Auth header set:', api.defaults.headers.common["Authorization"]); // Debug log
      console.log('localStorage token after setting:', localStorage.getItem('token')); // New debug log
      
      // Update user context
      setUser(response.data.user);
      
      // Reset any error states on successful login
      setError("");
      setAttemptsRemaining(3);
      setBlockDuration(0);
      setCountdown(0);
      
      // Navigate to dashboard without page reload
      navigateToDashboard(response.data.user.role);
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.error || error.message
      );
      
      const { attemptsRemaining, blockDuration } = error.response?.data || {};
      
      if (blockDuration) {
        setBlockDuration(blockDuration);
        setCountdown(blockDuration);
        setError(`Too many failed attempts. Please try again in ${blockDuration} seconds.`);
      } else if (attemptsRemaining !== undefined) {
        setAttemptsRemaining(attemptsRemaining);
        setError(`Invalid credentials. ${attemptsRemaining} attempts remaining.`);
      } else {
        setError(error.response?.data?.error || "An error occurred during login");
      }
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
    // Navigate without page reload
    navigate(path, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <AuthBackground greenbg />
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 24px rgba(0, 46, 109, 0.1)',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src={process.env.REACT_APP_API_URL + "/uploads/full-white-app-logo.png"}
            alt="Logo"
            style={{ height: '200px', marginBottom: '16px', imageRendering: 'crisp-edges' }}
          />
          <Title level={3} style={{ margin: 0, color: '#002E6D' }}>Welcome Back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              color: '#ff4d4f',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '20px',
              padding: '8px',
              backgroundColor: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px'
            }}>
              {error}
              {attemptsRemaining < 3 && (
                <div style={{ marginTop: '4px', fontWeight: '500' }}>
                  {attemptsRemaining} attempts remaining
                </div>
              )}
            </div>
          )}
          <table style={{ width: "100%", marginBottom: "15px" }}>
            <tbody>
              <tr
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <td
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    alignContent: "center",
                    alignSelf: "center",
                    padding: "5px",
                  }}
                >
                  <FaEnvelope />
                </td>
                <td style={{ flex: 1 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      padding: "10px",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: "100%", marginBottom: "15px" }}>
            <tbody>
              <tr
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <td
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    alignContent: "center",
                    alignSelf: "center",
                    padding: "5px",
                  }}
                >
                  <FaLock />
                </td>
                <td style={{ flex: 1, position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      padding: "10px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '5px',
                      color: '#666',
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <tbody>
              <tr
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <td
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    alignContent: "center",
                    alignSelf: "center",
                    padding: "5px",
                  }}
                >
                  <FaGlobe />
                </td>
                <td style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={firmId}
                    onChange={(e) => setFirmId(e.target.value)}
                    placeholder="Firm ID"
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      padding: "10px",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#012e71",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Login
          </button>
          <Divider>Or</Divider>
          <GoogleOAuthButton mode="login" />
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Don't have an account?{" "}
          <a
            href="/register"
            style={{ color: "#012e71", textDecoration: "none" }}
          >
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Login;