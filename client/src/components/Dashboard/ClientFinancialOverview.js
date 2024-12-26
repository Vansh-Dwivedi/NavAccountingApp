import React from "react";
import { Card, Row, Col, Statistic, Progress, Typography } from "antd";
import {
  DollarOutlined,
  TrophyOutlined,
  BankOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Line, Bar, Doughnut, Radar, Scatter, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import EditableHistoryChart from "../shared/EditableHistoryChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

const StatCard = ({ title, value, prefix, suffix, icon, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
    <Card
      hoverable
      style={{
        borderRadius: "15px",
        background: `linear-gradient(135deg, ${color}15, ${color}30)`,
        border: `1px solid ${color}50`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {icon && <div style={{ fontSize: "24px", color: color }}>{icon}</div>}
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
  // Common data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const balanceData = months.map(
    (_, i) => clientData.totalBalance * (0.8 + i * 0.05)
  );
  const availableData = months.map(
    (_, i) => clientData.availableBalance * (0.75 + i * 0.05)
  );

  // Line Chart Config - Balance History
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Total Balance",
        data: balanceData,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "Available Balance",
        data: availableData,
        borderColor: "#52c41a",
        backgroundColor: "rgba(82, 196, 26, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Bar Chart Config - Monthly Income vs Expenses
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map(() => Math.random() * 5000 + 3000),
        backgroundColor: "rgba(82, 196, 26, 0.6)",
      },
      {
        label: "Expenses",
        data: months.map(() => Math.random() * 4000 + 2000),
        backgroundColor: "rgba(245, 34, 45, 0.6)",
      },
    ],
  };

  // Doughnut Chart Config - Expense Distribution
  const doughnutChartData = {
    labels: ["Housing", "Food", "Transport", "Entertainment", "Utilities"],
    datasets: [
      {
        data: [30, 20, 15, 20, 15],
        backgroundColor: [
          "#1890ff",
          "#52c41a",
          "#722ed1",
          "#fa8c16",
          "#eb2f96",
        ],
      },
    ],
  };

  // Radar Chart Config - Financial Health Metrics
  const radarChartData = {
    labels: [
      "Savings",
      "Investments",
      "Credit Score",
      "Debt Ratio",
      "Emergency Fund",
    ],
    datasets: [
      {
        label: "Current Status",
        data: [85, 65, 75, 80, 70],
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        borderColor: "#1890ff",
      },
    ],
  };

  // Scatter Chart Config - Income vs Savings
  const scatterChartData = {
    datasets: [
      {
        label: "Income vs Savings",
        data: Array.from({ length: 20 }, () => ({
          x: Math.random() * 10000,
          y: Math.random() * 5000,
        })),
        backgroundColor: "rgba(114, 46, 209, 0.6)",
      },
    ],
  };
  
  return (
    <div style={{ padding: "20px 0" }}>
      <Title level={4} style={{ marginBottom: "24px" }}>
        Financial Overview
      </Title>

      {/* Stats Cards */}
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
            style={{ marginTop: "10px" }}
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

      {/* Chart Row 1 */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {/* Line Chart - Balance History */}
        <Col xs={24} lg={12}>
          <Card title="Balance History" bordered={false}>
            <Line data={lineChartData} />
          </Card>
        </Col>
        {/* Bar Chart - Income vs Expenses */}
        <Col xs={24} lg={12}>
          <Card title="Monthly Income vs Expenses" bordered={false}>
            <Bar data={barChartData} />
          </Card>
        </Col>
      </Row>

      {/* Chart Row 2 */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {/* Doughnut Chart - Expense Distribution */}
        <Col xs={24} lg={8}>
          <Card title="Expense Distribution" bordered={false}>
            <Doughnut data={doughnutChartData} />
          </Card>
        </Col>
        {/* Radar Chart - Financial Health */}
        <Col xs={24} lg={8}>
          <Card title="Financial Health Overview" bordered={false}>
            <Radar data={radarChartData} />
          </Card>
        </Col>
        {/* Scatter Chart - Income vs Savings */}
        <Col xs={24} lg={8}>
          <Card title="Income vs Savings Analysis" bordered={false}>
            <Scatter data={scatterChartData} />
          </Card>
        </Col>
      </Row>

      {/* Chart Row 3 */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {/* Historical Charts */}
        <Col xs={24} lg={12}>
          <EditableHistoryChart
            title="Total Balance History"
            data={clientData.balanceHistory || []}
            metric="Total Balance"
            readOnly={true}
            showFilters={true}
          />
        </Col>
        {/* Historical Charts */}
        <Col xs={24} lg={12}>
          <EditableHistoryChart
            title="Credit Score History"
            data={clientData.creditScoreHistory || []}
            metric="Credit Score"
            readOnly={true}
            showFilters={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ClientFinancialOverview;
