import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { DollarOutlined, TrophyOutlined, BankOutlined, RiseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Line, Pie } from '@ant-design/plots';
import FinancialHistoryChart from '../shared/FinancialHistoryChart';

const { Title } = Typography;

const StatCard = ({ title, value, prefix, suffix, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card
      hoverable
      style={{
        borderRadius: '15px',
        background: `linear-gradient(135deg, ${color}15, ${color}30)`,
        border: `1px solid ${color}50`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icon && <div style={{ fontSize: '24px', color: color }}>{icon}</div>}
        <Statistic
          title={<span style={{ color: `${color}90` }}>{title}</span>}
          value={value}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{ color: color }}
        />
      </div>
    </Card>
  </motion.div>
);

const ClientFinancialOverview = ({ clientData }) => {
  // Sample data for the line chart - in production, this would come from an API
  const balanceHistory = [
    { date: '2023-01', value: clientData.totalBalance * 0.8 },
    { date: '2023-02', value: clientData.totalBalance * 0.85 },
    { date: '2023-03', value: clientData.totalBalance * 0.9 },
    { date: '2023-04', value: clientData.totalBalance * 0.95 },
    { date: '2023-05', value: clientData.totalBalance },
  ];

  const lineConfig = {
    data: balanceHistory,
    xField: 'date',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
  };

  const pieData = [
    { type: 'Available', value: clientData.availableBalance || 0 },
    { type: 'Reserved', value: (clientData.totalBalance - clientData.availableBalance) || 0 },
  ];

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      offset: '-50%',
      content: '{name}: {percentage}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    animation: {
      appear: {
        animation: 'wave',
        duration: 1000,
      },
    },
    color: ['#52c41a', '#1890ff'],
    legend: {
      position: 'bottom'
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={4} style={{ marginBottom: '24px' }}>Financial Overview</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Balance"
            value={clientData.totalBalance || 0}
            prefix={<DollarOutlined />}
            color="#1890ff"
            icon={<BankOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Available Balance"
            value={clientData.availableBalance || 0}
            prefix={<DollarOutlined />}
            color="#52c41a"
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Credit Score"
            value={clientData.creditScore || 0}
            suffix="/ 850"
            color="#722ed1"
            icon={<TrophyOutlined />}
          />
          <Progress
            percent={(clientData.creditScore / 850) * 100}
            showInfo={false}
            strokeColor="#722ed1"
            trailColor="#722ed130"
            style={{ marginTop: '10px' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Annual Income"
            value={clientData.annualIncome || 0}
            prefix={<DollarOutlined />}
            color="#fa8c16"
            icon={<RiseOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Balance History" bordered={false}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Balance Distribution" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <FinancialHistoryChart 
            userId={clientData._id}
            metric="Credit Score"
          />
        </Col>
        <Col span={24}>
          <FinancialHistoryChart 
            userId={clientData._id}
            metric="Total Balance"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ClientFinancialOverview;