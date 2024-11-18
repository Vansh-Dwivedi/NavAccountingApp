import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import { Form, Input, Button, message, Divider } from "antd";
import GoogleOAuthButton from '../GoogleOAuthButton';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await api.post("/api/auth/register", values);
      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      message.success("Registration successful");
      navigate("/client-dashboard");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data?.error || error.message
      );
      message.error(
        error.response?.data?.error || "An error occurred during registration"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        background: "#fff",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "8px",
          padding: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
          src={process.env.REACT_APP_API_URL + "/api/app/utils/app-logo.png"}
          alt="Logo"
          style={{
            display: "block",
            margin: "0 auto 20px",
            maxWidth: "200px",
          }}
        />
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          SIGN UP
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Create your account by filling in the information below
        </p>

        <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
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
                  <FaUser />
                </td>
                <td style={{ flex: 1 }}>
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: "Please input your username!" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input
                      placeholder="Username"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "10px",
                      }}
                    />
                  </Form.Item>
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
                  <FaEnvelope />
                </td>
                <td style={{ flex: 1 }}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input
                      placeholder="Email"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "10px",
                      }}
                    />
                  </Form.Item>
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
                  <FaLock />
                </td>
                <td style={{ flex: 1 }}>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please input your password!" },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters long!",
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder="Password"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "10px",
                      }}
                    />
                  </Form.Item>
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
                  <Form.Item
                    name="pin"
                    rules={[
                      { required: true, message: "Please input your 4-digit PIN!" },
                      {
                        pattern: /^\d{4}$/,
                        message: "PIN must be exactly 4 digits!",
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder="4-digit PIN for Sleep Mode"
                      maxLength={4}
                      type="number"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "10px",
                      }}
                    />
                  </Form.Item>
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
                  <Form.Item
                    name="firmId"
                    rules={[
                      { required: true, message: "Please input your Firm ID!" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <Input
                      placeholder="Firm ID"
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "10px",
                      }}
                    />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>

          <Button
            type="primary"
            htmlType="submit"
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
              height: "auto",
            }}
          >
            Register
          </Button>
        </Form>

        <Divider>Or</Divider>
        <GoogleOAuthButton mode="register" />

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#012e71", textDecoration: "none" }}
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
