import React, { useState } from "react";
import axios from "axios";
import { FaDollarSign, FaChartLine, FaUserTie, FaFileInvoiceDollar, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { Form, Input, Button, Slider, Checkbox, Select, InputNumber, DatePicker, message } from 'antd';
import 'antd/dist/reset.css';
import api from "../utils/api";

const { Option } = Select;

const InputForm = ({ clientId, onSubmit }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    revenue: "",
    expenses: "",
    employeeSalary: "",
    clientData: "",
    taxCollected: "",
    projectCompletion: 0,
    complianceStatus: false,
    dateRange: "Monthly",
    cashFlow: [],
    invoices: {
      paid: 0,
      overdue: 0,
      pending: 0
    },
    profitLossSummary: {
      revenue: 0,
      expenses: 0,
      netProfit: 0,
      period: ''
    }
  });

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onFinish = async (values) => {
    try {
      await api.post(`/api/financial-info/${clientId}`, values);
      message.success('Financial data submitted successfully');
      form.resetFields();
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting financial data:', error);
      message.error('Failed to submit financial data');
    }
  };

  return (
    <div className="input-form" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="totalBalance" label="Total Balance" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="revenue" label="Revenue" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="expenses" label="Expenses" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="annualRevenue" label="Annual Revenue" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="annualExpenses" label="Annual Expenses" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="totalAssets" label="Total Assets" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="totalLiabilities" label="Total Liabilities" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="cashOnHand" label="Cash on Hand" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="accountsReceivable" label="Accounts Receivable" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="accountsPayable" label="Accounts Payable" rules={[{ required: true }]}>
          <InputNumber prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label={<><FaUserTie style={{ marginRight: "8px" }} />Employee Salary:</>} name="employeeSalary">
          <Input
            type="text"
            name="employeeSalary"
            value={formData.employeeSalary}
            onChange={(e) => handleChange('employeeSalary', e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<><FaChartLine style={{ marginRight: "8px" }} />Client Data:</>} name="clientData">
          <Input
            type="text"
            name="clientData"
            value={formData.clientData}
            onChange={(e) => handleChange('clientData', e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<><FaDollarSign style={{ marginRight: "8px" }} />Tax Collected:</>} name="taxCollected">
          <Input
            type="text"
            name="taxCollected"
            value={formData.taxCollected}
            onChange={(e) => handleChange('taxCollected', e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<><FaCheckCircle style={{ marginRight: "8px" }} />Project Completion Status (%):</>} name="projectCompletion">
          <Slider
            name="projectCompletion"
            min={0}
            max={100}
            value={formData.projectCompletion}
            onChange={(value) => setFormData({ ...formData, projectCompletion: value })}
          />
          <span>{formData.projectCompletion}%</span>
        </Form.Item>
        <Form.Item name="complianceStatus" valuePropName="checked">
          <Checkbox
            name="complianceStatus"
            checked={formData.complianceStatus}
            onChange={(e) => handleChange('complianceStatus', e.target.checked)}
          >
            <FaCheckCircle style={{ marginRight: "8px" }} />Compliance Status
          </Checkbox>
        </Form.Item>
        <Form.Item name="dateRange" label="Date Range" rules={[{ required: true }]}>
          <Select>
            <Option value="Monthly">Monthly</Option>
            <Option value="Quarterly">Quarterly</Option>
            <Option value="Yearly">Yearly</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit Financial Data
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputForm;
