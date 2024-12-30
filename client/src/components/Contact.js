import React, { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';
import './Contact.css';
import { FrontHeader, FrontFooter } from './Header&Footer';
import api from '../utils/api';

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

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

  const contactInfo = [
    {
      icon: <PhoneOutlined className="contact-icon" />,
      title: "Phone",
      content: "+1 530-777-3265",
      link: "tel:+15307773265"
    },
    {
      icon: <MailOutlined className="contact-icon" />,
      title: "Email",
      content: "info@navaccounts.com",
      link: "mailto:info@navaccounts.com"
    },
    {
      icon: <EnvironmentOutlined className="contact-icon" />,
      title: "Office",
      content: "1469 Butte House Rd, Ste E, Yuba City, CA 95993",
      link: "https://maps.google.com/?q=1469+Butte+House+Rd,+Yuba+City,+CA+95993"
    },
    {
      icon: <ClockCircleOutlined className="contact-icon" />,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 5:00 PM PST"
    }
  ];

  return (
    <Layout className="layout">
      <FrontHeader activeKey="/contact" />
      <Content>
        <div className="contact-container">
          <section className="contact-hero">
            <Title>Contact Us</Title>
            <Text className="contact-intro">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Text>
          </section>

          <Row gutter={[32, 32]} className="contact-content">
            <Col xs={24} md={10}>
              <Card className="contact-info-card">
                <Title level={2}>Contact Information</Title>
                <Space direction="vertical" size="large" className="contact-info-items">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="contact-info-item">
                      {item.icon}
                      <div>
                        <Text strong>{item.title}</Text>
                        {item.link ? (
                          <a href={item.link} target={item.title === "Office" ? "_blank" : undefined} rel="noopener noreferrer">
                            <Text>{item.content}</Text>
                          </a>
                        ) : (
                          <Text>{item.content}</Text>
                        )}
                      </div>
                    </div>
                  ))}
                </Space>
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
                        <Input 
                          prefix={<UserOutlined />} 
                          size="large" 
                          placeholder="Enter your first name" 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input 
                          prefix={<UserOutlined />} 
                          size="large" 
                          placeholder="Enter your last name" 
                        />
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
                    <Input 
                      prefix={<MailOutlined />} 
                      size="large" 
                      placeholder="Enter your email address" 
                    />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      size="large" 
                      placeholder="Enter your phone number" 
                    />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea
                      prefix={<MessageOutlined />}
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
                      icon={<MailOutlined />}
                      block
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