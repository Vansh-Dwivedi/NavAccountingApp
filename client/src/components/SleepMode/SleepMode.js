import React, { useState } from "react";
import { Modal, Input, Form, message, Button, Result } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const SleepMode = ({ isActive, onExit }) => {
  const [unlockModalVisible, setUnlockModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleUnlock = async (values) => {
    try {
      const response = await api.post("/api/users/verify-password", {
        password: values.password,
      });

      if (response.data.isValid) {
        await api.put("/api/users/sleep-mode", { isInSleepMode: false });
        onExit();
        setUnlockModalVisible(false);
        form.resetFields();
      } else {
        message.error("Incorrect password");
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
          title={<span style={{ color: "white", fontSize: "24px" }}>Sleep Mode Active</span>}
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
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      >
        <Form form={form} onFinish={handleUnlock}>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
            style={{ marginTop: "20px" }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              autoFocus
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
