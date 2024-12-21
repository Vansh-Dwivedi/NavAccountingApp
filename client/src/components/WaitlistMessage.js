import React, { useState, useEffect } from 'react';
import { Result, Button, Layout, Typography, Space, Modal, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const WaitlistMessage = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCheckUpdates = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false); // Reset visible state after loading is done
    }, 2000);
  };

  useEffect(() => {
    if (visible) {
      handleOk();
      setShowModal(true);
    }
  }, [visible]);

  return (
    <Layout style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Trebuchet MS',
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      letterSpacing: '1px',
      textTransform: 'capitalize',
    }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Result
          status="info"
          title={
            <Space direction="vertical" size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#434343', fontSize: '24px' }}>
                Waitlist Notification
              </Title>
              <Text type="secondary" style={{ fontSize: '18px' }}>
                You are currently on the waitlist. Please check back later for updates.
              </Text>
            </Space>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<ClockCircleOutlined />}
              style={{
                background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 2px 0 rgba(0,0,0,0.045)',
                height: '40px',
                paddingInline: '30px',
                borderRadius: '8px',
                fontSize: '18px',
              }}
              onClick={handleCheckUpdates}
            >
              Check Updates
            </Button>
          }
          style={{
            background: 'white',
            padding: '48px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <Modal
          title="Updates"
          visible={showModal}
          footer={[
            <Button key="submit" type="primary" onClick={() => setShowModal(false)}>
              OK
            </Button>,
          ]}
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '24px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              <Paragraph style={{ fontSize: '18px', color: '#333' }}>
                Our Chartered Accountant (CA) team will regularly update your dashboard to ensure it reflects the latest and most accurate financial data.
              </Paragraph>
              <Paragraph style={{ fontSize: '18px', color: '#333' }}>
                Whether it's income statements, expense tracking, tax summaries, or compliance updates, your dashboard will always be up-to-date. This ensures you have real-time insights into your financial health, enabling you to make informed decisions with ease and confidence.
              </Paragraph>
              <Paragraph style={{ fontSize: '18px', color: '#333' }}>
                Rest assured, our team is committed to providing precise and reliable updates tailored to your specific requirements.
              </Paragraph>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default WaitlistMessage; 