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
  max-width: 100%;
  margin: 0 auto;
  background-color: #ffffff; 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(motion.div)`
  background: #FFFFFF; /* White */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px;
  color: #001F3F; /* Navy Blue */
  font-weight: 700;
`;

const StyledButton = styled(Button)`
  background: #001F3F; /* Navy Blue */
  color: white;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background: #002E6D; /* Darker Navy Blue */
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  border-radius: 5px;
  padding-left: 50px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #001F3F; /* Navy Blue */
    box-shadow: 0 0 0 2px rgba(0, 31, 63, 0.2);
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

const formatCardNumber = (value) => {
  if (!value) return value;
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

const formatExpiryDate = (value) => {
  if (!value) return value;
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2, 4);
  }
  return v;
};

const formatAmount = (value) => {
  if (!value) return '';
  // Remove any non-digit characters except decimal point
  value = value.replace(/[^\d.]/g, '');
  
  // Handle partial inputs
  if (value === '.') return '0.';
  if (value.startsWith('.')) value = '0' + value;
  
  // Ensure only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
  
  // Don't format if it's a partial input
  if (value.endsWith('.')) return `$${value}`;
  
  // Format the number
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  // Limit to max value
  if (numValue > 9999.99) value = '9999.99';
  
  return `$${parseFloat(value).toLocaleString('en-US', { 
    minimumFractionDigits: value.includes('.') ? 2 : 0,
    maximumFractionDigits: 2 
  })}`;
};

const getNumericValue = (value) => {
  if (!value) return null;
  const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(numValue) ? null : numValue;
};

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment`, {
        ...values,
        cardNumber: values.cardNumber.replace(/\s+/g, ''),
        expirationDate: values.expirationDate.replace('/', ''),
      });
      
      if (response.data.success) {
        message.success('Payment processed successfully!');
        form.resetFields();
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
      <StyledForm
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Form 
          form={form}
          name="payment" 
          onFinish={onFinish} 
          layout="vertical"
          validateTrigger={['onChange', 'onBlur']}
        >
          <InputWrapper>
            <IconWrapper><DollarOutlined /></IconWrapper>
            <Form.Item
              name="amount"
              validateFirst={true}
              rules={[
                { required: true, message: 'Please enter the payment amount' },
                { 
                  validator: async (_, value) => {
                    const numericValue = getNumericValue(value);
                    if (numericValue === null || numericValue <= 0) {
                      throw new Error('Amount must be greater than 0');
                    }
                    if (numericValue > 9999.99) {
                      throw new Error('Amount cannot exceed $9,999.99');
                    }
                  }
                }
              ]}
              getValueFromEvent={(e) => {
                const value = e.target.value.replace(/[$,]/g, '');
                return formatAmount(value);
              }}
              normalize={(value) => value || ''}
            >
              <StyledInput 
                placeholder="Amount"
              />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <Form.Item
              name="cardNumber"
              rules={[
                { required: true, message: 'Please enter your card number' },
                { pattern: /^[\d\s]{13,19}$/, message: 'Please enter a valid card number' }
              ]}
              getValueFromEvent={(e) => formatCardNumber(e.target.value)}
            >
              <StyledInput 
                placeholder="Card Number" 
                maxLength={19}
              />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <Form.Item
              name="expirationDate"
              rules={[
                { required: true, message: 'Please enter the expiration date' },
                { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'Please enter a valid date (MM/YY)' }
              ]}
              getValueFromEvent={(e) => formatExpiryDate(e.target.value)}
            >
              <StyledInput 
                placeholder="MM/YY" 
                maxLength={5}
              />
            </Form.Item>
          </InputWrapper>

          <InputWrapper>
            <Form.Item
              name="cvv"
              rules={[
                { required: true, message: 'Please enter the CVV' },
                { pattern: /^[0-9]{3,4}$/, message: 'CVV must be 3 or 4 digits' }
              ]}
            >
              <StyledInput 
                placeholder="CVV" 
                maxLength={4} 
                type="password"
              />
            </Form.Item>
          </InputWrapper>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading} block>
              Complete Payment
            </StyledButton>
          </Form.Item>
        </Form>
      </StyledForm>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: '30px' }} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" style={{ height: '30px' }} />
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="American Express" style={{ height: '30px' }} />
      </div>
    </StyledContent>
  );
};

export default Payment;
