import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, message } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './Contact.css';
import { FrontHeader, FrontFooter } from './FrontPage';

const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you would typically send the form data to your backend
      console.log('Form values:', values);
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
      content: '+1 (123) 456-7890'
    },
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'contact@navaccounts.com'
    },
    {
      icon: <HomeOutlined />,
      title: 'Address',
      content: '123 Business Street, Suite 100, City, State 12345'
    }
  ];

  const socialLinks = [
    { icon: <FacebookOutlined />, link: 'https://facebook.com' },
    { icon: <TwitterOutlined />, link: 'https://twitter.com' },
    { icon: <LinkedinOutlined />, link: 'https://linkedin.com' },
    { icon: <InstagramOutlined />, link: 'https://instagram.com' }
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
              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  {socialLinks.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="link"
                        icon={item.icon}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    </motion.div>
                  ))}
                </div>
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
                    prefix={<MessageOutlined />}
                    placeholder="Your Message"
                    rows={4}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="contact-submit-btn"
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
