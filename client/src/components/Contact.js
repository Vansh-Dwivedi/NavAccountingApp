import React, { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Card, Typography, message } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './Contact.css';
import { FrontHeader, FrontFooter } from './FrontPage';
import api from '../utils/api';

const { Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/api/contact/submit', values);
      message.success('Thank you for your message! We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again later.');
      console.error('Contact form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout">
      <FrontHeader />
      <Content>
        <div className="contact-container">
          <div className="contact-hero">
            <img 
              src="https://localhost:8443/uploads/contact-banner.png" 
              alt="Contact Us"
              style={{ 
                width: '100%', 
                height: 'auto', 
                marginBottom: '2rem',
                borderRadius: '15px'
              }}
            />
            <p className="contact-intro" style={{ color: '#333' }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <Row gutter={[32, 32]} className="contact-content">
            <Col xs={24} md={10}>
              <Card className="contact-info-card">
                <Title level={2}>Contact Information</Title>
                <div className="contact-info-items">
                  <div className="contact-info-item">
                    <PhoneOutlined className="contact-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>+1 530-777-3265</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <MailOutlined className="contact-icon" />
                    <div>
                      <h4>Email</h4>
                      <p>info@navaccounts.com</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <EnvironmentOutlined className="contact-icon" />
                    <div>
                      <h4>Office</h4>
                      <p>1469 Butte House Rd, Ste E,<br />Yuba City, CA 95993</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={14}>
              <Card className="contact-form-card">
                <Title level={2}>Send us a Message</Title>
                <Form
                  form={form}
                  name="contact"
                  onFinish={onFinish}
                  layout="vertical"
                  requiredMark={false}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input size="large" placeholder="Enter your first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input size="large" placeholder="Enter your last name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input size="large" placeholder="Enter your email address" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input size="large" placeholder="Enter your phone number" />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="How can we help you?"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large"
                      loading={loading}
                      style={{ width: '100%' }}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Contact;