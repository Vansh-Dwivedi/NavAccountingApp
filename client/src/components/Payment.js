import React, { useState } from 'react';
import { Layout, Form, Input, Button, message, Typography } from 'antd';
import { CreditCardOutlined, CalendarOutlined, LockOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title } = Typography;

const StyledContent = styled(Content)`
  padding: 50px 20px;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 700;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #1a2a6c, #b21f1f);
  border: none;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #b21f1f, #fdbb2d);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

const StyledInput = styled(Input)`
  height: 50px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding-left: 50px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.2);
  }
`;

const IconWrapper = styled.span`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #888;
  font-size: 20px;
`;

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/payment', {
        ...values,
        apiLoginID: '4kHquKhN263qg393',
      });
      
      if (response.data.success) {
        message.success('Payment processed successfully!');
      } else {
        message.error('Payment failed. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again later.');
      console.error('Payment error:', error);
    }
    setLoading(false);
  };

  return (
    <StyledContent>
      <StyledTitle level={2}>Secure Payment</StyledTitle>
      <StyledForm
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Form name="payment" onFinish={onFinish} layout="vertical">
          <InputWrapper>
            <IconWrapper><DollarOutlined /></IconWrapper>
            <Form.Item
              name="amount"
              rules={[{ required: true, message: 'Please enter the payment amount' }]}
            >
              <StyledInput type="number" step="0.01" placeholder="Amount" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <IconWrapper><CreditCardOutlined /></IconWrapper>
            <Form.Item
              name="cardNumber"
              rules={[{ required: true, message: 'Please enter your card number' }]}
            >
              <StyledInput placeholder="Card Number" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <IconWrapper><CalendarOutlined /></IconWrapper>
            <Form.Item
              name="expirationDate"
              rules={[{ required: true, message: 'Please enter the expiration date' }]}
            >
              <StyledInput placeholder="MM/YY" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <IconWrapper><LockOutlined /></IconWrapper>
            <Form.Item
              name="cvv"
              rules={[{ required: true, message: 'Please enter the CVV' }]}
            >
              <StyledInput placeholder="CVV" />
            </Form.Item>
          </InputWrapper>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading} block>
              {loading ? 'Processing...' : 'Complete Payment'}
            </StyledButton>
          </Form.Item>
        </Form>
      </StyledForm>
    </StyledContent>
  );
};

export default Payment;
