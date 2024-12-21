import React, { useState } from 'react';
import { Form, InputNumber, Button, Card, Row, Col, Table, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ClientFinancialDataForm = ({ initialData, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [monthlyData, setMonthlyData] = useState(initialData?.monthlyData || [
    { month: 'Jan', income: 0, expenses: 0 },
    { month: 'Feb', income: 0, expenses: 0 },
    { month: 'Mar', income: 0, expenses: 0 },
    { month: 'Apr', income: 0, expenses: 0 },
    { month: 'May', income: 0, expenses: 0 },
    { month: 'Jun', income: 0, expenses: 0 }
  ]);

  const [expenseDistribution, setExpenseDistribution] = useState(initialData?.expenseDistribution || [
    { category: 'Housing', percentage: 30 },
    { category: 'Food', percentage: 20 },
    { category: 'Transport', percentage: 15 },
    { category: 'Entertainment', percentage: 20 },
    { category: 'Utilities', percentage: 15 }
  ]);

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      monthlyData,
      expenseDistribution,
      financialHealth: {
        savings: values.savings,
        investments: values.investments,
        creditScore: values.creditScore,
        debtRatio: values.debtRatio,
        emergencyFund: values.emergencyFund
      }
    };
    onSubmit(formData);
  };

  const monthlyColumns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
      render: (text, record, index) => (
        <InputNumber
          value={text}
          onChange={(value) => {
            const newData = [...monthlyData];
            newData[index].income = value;
            setMonthlyData(newData);
          }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      )
    },
    {
      title: 'Expenses',
      dataIndex: 'expenses',
      key: 'expenses',
      render: (text, record, index) => (
        <InputNumber
          value={text}
          onChange={(value) => {
            const newData = [...monthlyData];
            newData[index].expenses = value;
            setMonthlyData(newData);
          }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      )
    }
  ];

  const expenseColumns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, record, index) => (
        <InputNumber
          value={text}
          min={0}
          max={100}
          onChange={(value) => {
            const newData = [...expenseDistribution];
            newData[index].percentage = value;
            setExpenseDistribution(newData);
          }}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
        />
      )
    }
  ];

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={initialData}>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="Monthly Income & Expenses">
            <Table
              dataSource={monthlyData}
              columns={monthlyColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Expense Distribution">
            <Table
              dataSource={expenseDistribution}
              columns={expenseColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Financial Health Metrics">
            <Form.Item name="savings" label="Savings Score">
              <InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
            </Form.Item>
            <Form.Item name="investments" label="Investments Score">
              <InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
            </Form.Item>
            <Form.Item name="creditScore" label="Credit Score">
              <InputNumber min={300} max={850} />
            </Form.Item>
            <Form.Item name="debtRatio" label="Debt Ratio">
              <InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
            </Form.Item>
            <Form.Item name="emergencyFund" label="Emergency Fund Score">
              <InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 16 }}>
        Update Financial Data
      </Button>
    </Form>
  );
};

export default ClientFinancialDataForm; 