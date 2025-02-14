import React, { useState } from 'react';
import { Form, Input, Button, message, Layout } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { FrontHeader, FrontFooter } from './HeaderFooter';
import PaymentHeader from './PaymentHeader';
import Hero from './Hero'; // Import the Hero component

const { TextArea } = Input;
const { Content } = Layout;

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      message.error('Please fill in all required fields');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      message.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create email content
      const subject = `Contact Form: ${formData.firstName} ${formData.lastName}`;
      const body = `
            Name: ${formData.firstName} ${formData.lastName}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Message: ${formData.message}
            `;

      // Create mailto URL
      const mailtoUrl = `mailto:navaccounts@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open default email client
      window.location.href = mailtoUrl;

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });

      message.success('Email client opened with your message!');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to open email client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PaymentHeader />
      <FrontHeader />
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        background: '#f5f5f5 !important'
      }}>
        <Content style={{
          background: '#f5f5f5 !important'
        }}>
          <Hero
            title="Contact Us"
            description="Get in touch with us for any inquiries or to schedule a consultation."
            backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.png`}
            style={{ backgroundColor: '#ffffff !important' }}
          />
        </Content>

        {/* Contact Form Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff !important'
        }}>
          {/* Contact Information */}
          <div style={{
            flex: '1',
            minWidth: '300px',
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff !important'
          }}>
            <h2 style={{ marginBottom: '30px', color: '#000000 !important', backgroundColor: '#ffffff !important' }}>Contact Information</h2>

            <div style={{ marginBottom: '20px' }}>
              <PhoneOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333', backgroundColor: '#ffffff !important' }}>Phone</h3>
                <p style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>+1 530-777-3265</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <MailOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333', backgroundColor: '#ffffff !important' }}>Email</h3>
                <p style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>navaccounts@yahoo.com</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <EnvironmentOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333', backgroundColor: '#ffffff !important' }}>Address</h3>
                <p style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>1469 Butte House Rd, Ste E, Yuba City, CA 95993</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            flex: '1.5',
            minWidth: '300px',
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff !important'
          }}>
            <h2 style={{ marginBottom: '30px', color: '#000000 !important', backgroundColor: '#ffffff !important' }}>Send us a Message</h2>

            <Form
              layout="vertical"
              style={{ backgroundColor: '#ffffff !important' }}
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                <Form.Item
                  name="firstName"
                  label={<span style={{ color: '#000000 !important' }}>First Name</span>}
                  required
                  validateStatus={!formData.firstName && formData.firstName !== '' ? 'error' : ''}
                >
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label={<span style={{ color: '#000000 !important' }}>Last Name</span>}
                  required
                  validateStatus={!formData.lastName && formData.lastName !== '' ? 'error' : ''}
                >
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<span style={{ color: '#000000 !important' }}>Email</span>}
                required
                validateStatus={!formData.email && formData.email !== '' ? 'error' : ''}
              >
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span style={{ color: '#000000 !important' }}>Phone</span>}
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span style={{ color: '#000000 !important' }}>Message</span>}
                required
                validateStatus={!formData.message && formData.message !== '' ? 'error' : ''}
              >
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  rows={4}
                  style={{ backgroundColor: '#ffffff !important', color: '#000000 !important' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  style={{
                    height: '45px',
                    width: '100%',
                    fontSize: '16px',
                    backgroundColor: '#1890ff !important'
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <FrontFooter />
    </>
  );
};

export default Contact;