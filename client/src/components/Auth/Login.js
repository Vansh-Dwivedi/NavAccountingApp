import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import GoogleOAuthButton from '../GoogleOAuthButton';
import { Divider } from 'antd';
import AnimatedGraphic from '../AnimatedGraphic';

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative" style={{ zIndex: '999999 !important' }}>
      <AnimatedGraphic />
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "8px",
          padding: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Nav Accounts
        </h1>
        <img
          src={process.env.REACT_APP_API_URL + "/uploads/full-white-app-logo.svg"}
          alt="Logo"
          style={{
            display: "block",
            margin: "0 auto 20px",
            maxWidth: "200px",
            imageRendering: "-webkit-optimize-contrast",
            imageRendering: "crisp-edges",
          }}
        />
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          LOGIN
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Enter your credentials below to log in to your account
        </p>
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
      </div>
    </div>
  );
};

export default Login;