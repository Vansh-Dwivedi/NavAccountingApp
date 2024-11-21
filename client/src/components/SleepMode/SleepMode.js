import React, { useState, useEffect } from "react";
import { Modal, Input, Form, message, Button, Result, Spin, Alert } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const SleepMode = ({ isActive, onExit, setActiveTab }) => {
  const [unlockModalVisible, setUnlockModalVisible] = useState(false);
  const [hasPin, setHasPin] = useState(true); // Assuming the user has a PIN by default
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Added for loading state

  useEffect(() => {
    const checkAuthMethod = async () => {
      try {
        const response = await api.get("/api/users/profile");
        setHasPin(!!response.data.pin); // Check if the user has a PIN
      } catch (error) {
        console.error("Error checking auth method:", error);
      }
    };
    checkAuthMethod();
  }, []);

  const handleUnlock = async (values) => {
    try {
      setLoading(true); // Start loading
      // If the user has a PIN, verify it
      const response = await api.post("/api/users/verify-pin", {
        pin: values.pin,
      });
      if (response.data.isValid) {
        await api.put("/api/users/sleep-mode", { isInSleepMode: false });
        onExit();
        setUnlockModalVisible(false);
        form.resetFields();
        setActiveTab("dashboard");
      } else {
        message.error("Incorrect PIN");
      }
    } catch (error) {
      console.error("Error unlocking sleep mode:", error);
      message.error("Failed to unlock sleep mode");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true); // Start loading
      await api.put("/api/users/updpinforslemo", { pin: values.pin });
      message.info("New PIN created successfully.");
      // After creating PIN, shift to unlock sleep mode
      setHasPin(true);
      // Simulate a delay to show loading for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error creating new pin:", error);
      message.error("Failed to create new pin.");
    } finally {
      setLoading(false); // Stop loading
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
          hasPin ? (
            <span>
              <UnlockOutlined /> Unlock Dashboard
            </span>
          ) : (
            <span>
              <UnlockOutlined /> Create 4-digit PIN
            </span>
          )
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
        <Spin spinning={loading}>
          {" "}
          {/* Added Spin component for loading */}
          <Form form={form} onFinish={hasPin ? handleUnlock : handleCreate}>
            {!hasPin ? (
              <Alert
                description="To enhance your account security, please create a new 4-digit PIN. This will be used to authenticate your access in the future."
                type="info"
                showIcon
                style={{ marginBottom: "10px" }}
              />
            ) : (
              ""
            )}
            <Form.Item
              name="pin"
              rules={[
                {
                  required: true,
                  message: hasPin
                    ? "Please enter your PIN"
                    : "You don't have a PIN. Please enter your new PIN.",
                },
              ]}
            >
              <Input.Password
                maxLength={4}
                placeholder={
                  hasPin
                    ? "Enter your 4-digit PIN"
                    : "Enter your new 4-digit PIN"
                }
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
                {hasPin ? "Unlock" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default SleepMode;
