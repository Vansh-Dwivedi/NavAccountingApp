import React from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button, Layout, Typography, Space } from "antd";
import { LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Result
          status="403"
          icon={<LockOutlined style={{ color: "#ff4d4f", fontSize: "48px" }} />}
          title={
            <Space direction="vertical" size="large" style={{ display: "flex", alignItems: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#434343" }}>
                Unauthorized Access
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                You do not have permission to access this page.
              </Text>
            </Space>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(90deg, #1890ff 0%, #096dd9 100%)",
                border: "none",
                boxShadow: "0 2px 0 rgba(0,0,0,0.045)",
                height: "40px",
                paddingInline: "30px",
              }}
            >
              Go to Login
            </Button>
          }
          style={{
            background: "white",
            padding: "48px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "90%",
          }}
        />
      </Content>
    </Layout>
  );
};

export default Unauthorized;
