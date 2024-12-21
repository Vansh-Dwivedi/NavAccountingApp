import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, message } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './Contact.css';
import { FrontHeader, FrontFooter } from './FrontPage';
import api from '../utils/api';

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/api/contact/submit', values);
      message.success('Message sent successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <PhoneOutlined />,
      title: 'Phone',
      content: '+1 530-777-3265'
    },
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'info@navaccounts.com'
    }
  ];

  return (
    <>
      <FrontHeader activeKey="/contact" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="contact-container"
      >
        <div className="contact-hero">
          <h1>Get in Touch</h1>
          <p className="contact-intro">
            Have questions or need assistance? We're here to help! Reach out to us using any of the methods below.
          </p>
        </div>

        <Row gutter={[32, 32]} className="contact-content">
          <Col xs={24} md={10}>
            <Card className="contact-info-card">
              <h2>Contact Information</h2>
              <div className="contact-info">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="info-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="info-icon">{item.icon}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="contact-info-section">
                <img 
                  src="https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/contact-info-graphic.png"
                  alt="Contact Information"
                  className="contact-info-image"
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card className="contact-form-card">
              <h2>Send us a Message</h2>
              <Form
                form={form}
                name="contact"
                onFinish={onFinish}
                layout="vertical"
                className="contact-form"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="First Name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Last Name"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone Number"
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Your Message"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </motion.div>
      <FrontFooter />
    </>
  );
};

export default Contact;
