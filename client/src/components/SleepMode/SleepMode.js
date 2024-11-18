import React, { useState, useEffect } from "react";
import { Modal, Input, Form, message, Button, Result } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const SleepMode = ({ isActive, onExit, setActiveTab }) => {
  const [unlockModalVisible, setUnlockModalVisible] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const checkAuthMethod = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setIsGoogleUser(!!response.data.googleId);
      } catch (error) {
        console.error("Error checking auth method:", error);
      }
    };
    checkAuthMethod();
  }, []);

  const handleUnlock = async (values) => {
    try {
      const endpoint = isGoogleUser
        ? "/api/users/verify-pin"
        : "/api/users/verify-password";
      const response = await api.post(endpoint, {
        [isGoogleUser ? "pin" : "password"]:
          values[isGoogleUser ? "pin" : "password"],
      });

      if (response.data.isValid) {
        await api.put("/api/users/sleep-mode", { isInSleepMode: false });
        onExit();
        setUnlockModalVisible(false);
        form.resetFields();
        setActiveTab("dashboard");
      } else {
        message.error(isGoogleUser ? "Incorrect PIN" : "Incorrect password");
      }
    } catch (error) {
      console.error("Error unlocking sleep mode:", error);
      message.error("Failed to unlock sleep mode");
    }
  };

  if (!isActive) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 21, 41, 0.95)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Result
          icon={<LockOutlined style={{ color: "white", fontSize: "48px" }} />}
          title={
            <span style={{ color: "white", fontSize: "24px" }}>
              Sleep Mode Active
            </span>
          }
          extra={
            <Button
              type="ghost"
              icon={<UnlockOutlined />}
              onClick={() => setUnlockModalVisible(true)}
              style={{
                borderColor: "white",
                color: "white",
                fontSize: "16px",
              }}
            >
              Unlock
            </Button>
          }
          style={{
            backgroundColor: "transparent",
            position: "relative",
            zIndex: 1001,
          }}
        />
      </div>

      <Modal
        title={
          <span>
            <UnlockOutlined /> Unlock Dashboard
          </span>
        }
        open={unlockModalVisible}
        onCancel={() => setUnlockModalVisible(false)}
        footer={null}
        maskClosable={false}
        centered
        style={{ zIndex: 1002 }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Form form={form} onFinish={handleUnlock}>
          <Form.Item
            name={isGoogleUser ? "pin" : "password"}
            rules={[
              {
                required: true,
                message: isGoogleUser
                  ? "Please enter your PIN"
                  : "Please enter your password",
              },
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Enter your 4-digit PIN"
              type="number"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<UnlockOutlined />}
              block
            >
              Unlock
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SleepMode;
