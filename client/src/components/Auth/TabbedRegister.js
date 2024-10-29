import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import api from "../../utils/api";
import { Form, Input, Button, message } from "antd";

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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Nav Accounts</h1>
      <img
        src={process.env.REACT_APP_API_URL + "/api/app/utils/app-logo.png"}
        alt="Logo"
        style={{ display: "block", margin: "0 auto 24px", maxWidth: 200 }}
      />
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>SIGN UP</h2>

      <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
          ]}
        >
          <Input prefix={<FaUser />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input prefix={<FaEnvelope />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              min: 8,
              message: "Password must be at least 8 characters long!",
            },
          ]}
        >
          <Input.Password prefix={<FaLock />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
};

export default Register;
