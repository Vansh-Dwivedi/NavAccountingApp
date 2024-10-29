import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const FinancialOverview = ({ financialInfo }) => {
  if (!financialInfo) {
    return <div>No financial information available.</div>;
  }

  const incomeVsExpensesData = {
    labels: financialInfo.monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: financialInfo.monthlyData.map(item => item.income),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: financialInfo.monthlyData.map(item => item.expenses),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const cashFlowData = {
    labels: financialInfo.cashFlow.map(item => item.category),
    datasets: [
      {
        data: financialInfo.cashFlow.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      }
    ]
  };

  const invoiceStatusData = {
    labels: ['Paid', 'Overdue', 'Pending'],
    datasets: [
      {
        data: [
          financialInfo.invoices.paid,
          financialInfo.invoices.overdue,
          financialInfo.invoices.pending
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      }
    ]
  };

  const newIncomeVsExpensesData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [financialInfo.revenue, financialInfo.expenses],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const incomeVsExpensesData2 = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [financialInfo.annualRevenue, financialInfo.annualExpenses],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const assetsVsLiabilitiesData = {
    labels: ['Assets', 'Liabilities'],
    datasets: [
      {
        label: 'Amount',
        data: [financialInfo.totalAssets, financialInfo.totalLiabilities],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  return (
    <div className="financial-overview">
      <h2>Financial Overview</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Balance"
              value={financialInfo.totalBalance}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Revenue"
              value={financialInfo.revenue}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Expenses"
              value={financialInfo.expenses}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      <h3>Income vs Expenses</h3>
      <Bar data={newIncomeVsExpensesData} />

      <h3>Monthly Income vs Expenses</h3>
      <Line data={incomeVsExpensesData} />

      <h3>Cash Flow Summary</h3>
      <Pie data={cashFlowData} />

      <h3>Invoice Status</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Pie data={invoiceStatusData} />
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Outstanding Invoices"
              value={financialInfo.invoices.overdue + financialInfo.invoices.pending}
              precision={2}
              prefix="$"
            />
            <Progress
              percent={((financialInfo.invoices.overdue + financialInfo.invoices.pending) / 
                (financialInfo.invoices.paid + financialInfo.invoices.overdue + financialInfo.invoices.pending)) * 100}
              status="active"
            />
          </Card>
        </Col>
      </Row>

      <h3>Profit & Loss Summary ({financialInfo.dateRange})</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Revenue"
              value={financialInfo.revenue}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Expenses"
              value={financialInfo.expenses}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Net Profit"
              value={financialInfo.revenue - financialInfo.expenses}
              precision={2}
              prefix="$"
              valueStyle={{ color: (financialInfo.revenue - financialInfo.expenses) >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <h3>Net Worth</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Net Worth"
              value={financialInfo.totalAssets - financialInfo.totalLiabilities}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Annual Revenue"
              value={financialInfo.annualRevenue}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Annual Expenses"
              value={financialInfo.annualExpenses}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      <h3>Annual Income vs Expenses</h3>
      <Bar data={incomeVsExpensesData2} />

      <h3>Assets vs Liabilities</h3>
      <Bar data={assetsVsLiabilitiesData} />

      <h3>Cash Flow</h3>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Cash on Hand"
              value={financialInfo.cashOnHand}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Accounts Receivable"
              value={financialInfo.accountsReceivable}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Accounts Payable"
              value={financialInfo.accountsPayable}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialOverview;
