import { Modal, Typography } from "antd";
import { LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const LogoutConfirmModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#ff4d4f",
          }}
        >
          <LogoutOutlined style={{ fontSize: "20px" }} />
          <span>Confirm Logout</span>
        </div>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <LogoutOutlined />
          Logout
        </span>
      }
      cancelText="Cancel"
      okButtonProps={{
        danger: true,
        style: {
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
        },
      }}
      cancelButtonProps={{
        style: {
          border: "1px solid #d9d9d9",
        },
      }}
      centered
      maskClosable={false}
      width={400}
      bodyStyle={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <ExclamationCircleOutlined
          style={{
            fontSize: "22px",
            color: "#faad14",
          }}
        />
        <Typography.Text
          style={{
            margin: 0,
            fontSize: "16px",
            color: "rgba(0, 0, 0, 0.85)",
          }}
        >
          Are you sure you want to log out?
        </Typography.Text>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
