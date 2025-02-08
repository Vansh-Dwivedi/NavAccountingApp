import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { FrontHeader, FrontFooter } from './HeaderFooter';
import PaymentHeader from './PaymentHeader';

const { TextArea } = Input;

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
        paddingTop: '80px',
        background: '#f5f5f5'
      }}>
        {/* Hero Section */}
        <section className="hero-section" style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL}/uploads/common-hero.jpg)` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">Get in touch with us for any inquiries or to schedule a consultation.</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'space-between'
        }}>
          {/* Contact Information */}
          <div style={{
            flex: '1',
            minWidth: '300px',
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '30px', color: '#002E6D' }}>Contact Information</h2>

            <div style={{ marginBottom: '20px' }}>
              <PhoneOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333' }}>Phone</h3>
                <p>+1 530-777-3265</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <MailOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333' }}>Email</h3>
                <p>navaccounts@yahoo.com</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <EnvironmentOutlined style={{ fontSize: '24px', color: '#002E6D', marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '10px 0', color: '#333' }}>Address</h3>
                <p>1469 Butte House Rd, Ste E, Yuba City, CA 95993</p>
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '30px', color: '#002E6D' }}>Send us a Message</h2>

            <Form
              layout="vertical"
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  required
                  validateStatus={!formData.firstName && formData.firstName !== '' ? 'error' : ''}
                >
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Last Name"
                  required
                  validateStatus={!formData.lastName && formData.lastName !== '' ? 'error' : ''}
                >
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label="Email"
                required
                validateStatus={!formData.email && formData.email !== '' ? 'error' : ''}
              >
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone"
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                required
                validateStatus={!formData.message && formData.message !== '' ? 'error' : ''}
              >
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  rows={4}
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
                    backgroundColor: '#002E6D'
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