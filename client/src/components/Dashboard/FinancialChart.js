import React from 'react';
import { Line } from 'react-chartjs-2';

const FinancialChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Total Balance',
        data: data.map(item => item.totalBalance),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Outstanding Invoices',
        data: data.map(item => item.outstandingInvoices),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return <Line data={chartData} />;
};

export default FinancialChart;
