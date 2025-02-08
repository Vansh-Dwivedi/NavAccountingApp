import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button, Space } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header } = Layout;

const TopHeader = styled(Header)`
  background: #002E6D !important;
  height: 50px;
  line-height: 50px;
  padding: 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PhoneNumber = styled.a`
  color: white;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    color: #e6f7ff;
  }
`;

const PaymentButton = styled(Button)`
  background: white;
  border: none;
  height: 32px;
  padding: 4px 20px;
  border-radius: 4px;
  font-weight: 500;
  color: #002E6D;
  font-size: 14px;
  &:hover {
    background: #e6f7ff;
    color: #002E6D;
  }
`;

const PaymentHeader = () => (
  <TopHeader>
    <PhoneNumber href="tel:530-777-3265">
      <PhoneOutlined /> (530) 777-3265
    </PhoneNumber>
    <Link to="/payment">
      <PaymentButton>
        MAKE A PAYMENT
      </PaymentButton>
    </Link>
  </TopHeader>
);

export default PaymentHeader;
