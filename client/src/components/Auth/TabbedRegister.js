import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGlobe } from "react-icons/fa";
import api from "../../utils/api";
import { Form, Input, Button, message, Divider } from "antd";
import GoogleOAuthButton from '../GoogleOAuthButton';
import styles from './Auth.module.css';

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
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Nav Accounts</h1>
        <img
          src={process.env.REACT_APP_API_URL + "/api/app/utils/app-logo.png"}
          alt="Logo"
          className={styles.authLogo}
        />
        <h2 className={styles.authSubtitle}>SIGN UP</h2>
        <p className={styles.authDescription}>
          Create your account by filling in the information below
        </p>

        <Form form={form} name="register" onFinish={onFinish} scrollToFirstError className={styles.authForm}>
          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaUser />
              </div>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
                className={styles.authFormItem}
              >
                <Input placeholder="Username" className={styles.authInput} />
              </Form.Item>
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaEnvelope />
              </div>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                className={styles.authFormItem}
              >
                <Input placeholder="Email" className={styles.authInput} />
              </Form.Item>
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaLock />
              </div>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long!",
                  },
                ]}
                className={styles.authFormItem}
              >
                <Input.Password placeholder="Password" className={styles.authInput} />
              </Form.Item>
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaLock />
              </div>
              <Form.Item
                name="pin"
                rules={[
                  { required: true, message: "Please input your 4-digit PIN!" },
                  {
                    pattern: /^\d{4}$/,
                    message: "PIN must be exactly 4 digits!",
                  },
                ]}
                className={styles.authFormItem}
              >
                <Input.Password
                  placeholder="4-digit PIN for Sleep Mode"
                  maxLength={4}
                  type="number"
                  className={styles.authInput}
                />
              </Form.Item>
            </div>
          </div>

          <div className={styles.authInputGroup}>
            <div className={styles.authInputRow}>
              <div className={styles.authInputIcon}>
                <FaGlobe />
              </div>
              <Form.Item
                name="firmId"
                rules={[
                  { required: true, message: "Please input your Firm ID!" },
                ]}
                className={styles.authFormItem}
              >
                <Input placeholder="Firm ID" className={styles.authInput} />
              </Form.Item>
            </div>
          </div>

          <Button type="primary" htmlType="submit" className={styles.authButton}>
            Register
          </Button>
        </Form>

        <Divider className={styles.authDivider}>Or</Divider>
        <GoogleOAuthButton mode="register" />

        <div className={styles.authFooter}>
          Already have an account?{" "}
          <a href="/login" className={styles.authLink}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
