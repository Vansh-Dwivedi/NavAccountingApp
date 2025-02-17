import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import GoogleOAuthButton from '../GoogleOAuthButton';
import { Divider, Card, Typography } from 'antd';
import AnimatedGraphic from '../AnimatedGraphic';
import AuthBackground from '../AuthBackground';

const { Title, Text } = Typography;

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
      
      // Store token first
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      
      // Then navigate
      navigateToDashboard(response.data.user.role);
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
    // Remove the immediate reload to allow token storage to complete
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <AuthBackground />
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
            <div
              style={{
                backgroundColor: "#ffebee",
                color: "#c62828",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "20px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              {error}
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
                <td style={{ flex: 1 }}>
                  <input
                    type="password"
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