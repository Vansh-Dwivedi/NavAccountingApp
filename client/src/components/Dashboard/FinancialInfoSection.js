import React, { useState, useEffect } from 'react';
import { Tabs, Card, Statistic, Row, Col } from 'antd';
import api from '../../utils/api';
import FinancialOverview from './FinancialOverview';

const { TabPane } = Tabs;

const FinancialInfoSection = ({ clientId }) => {
  const [financialInfo, setFinancialInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialInfo = async () => {
      try {
        const response = await api.get(`/api/financial-info/${clientId}`);
        setFinancialInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial info:', error);
        setLoading(false);
      }
    };

    fetchFinancialInfo();
  }, [clientId]);

  if (loading) return <div>Loading financial information...</div>;

  return (
    <div className="financial-info-section">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          {financialInfo ? (
            <FinancialOverview financialInfo={financialInfo} />
          ) : (
            <div>No financial information available.</div>
          )}
        </TabPane>
        <TabPane tab="Detailed Information" key="2">
          {financialInfo ? (
            <Card title="Detailed Financial Information">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Total Assets" value={financialInfo.totalAssets} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Total Liabilities" value={financialInfo.totalLiabilities} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Net Worth" value={financialInfo.totalAssets - financialInfo.totalLiabilities} prefix="$" />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={8}>
                  <Statistic title="Annual Revenue" value={financialInfo.annualRevenue} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Annual Expenses" value={financialInfo.annualExpenses} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Net Profit" value={financialInfo.annualRevenue - financialInfo.annualExpenses} prefix="$" />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={8}>
                  <Statistic title="Cash on Hand" value={financialInfo.cashOnHand} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Accounts Receivable" value={financialInfo.accountsReceivable} prefix="$" />
                </Col>
                <Col span={8}>
                  <Statistic title="Accounts Payable" value={financialInfo.accountsPayable} prefix="$" />
                </Col>
              </Row>
            </Card>
          ) : (
            <div>No detailed financial information available.</div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FinancialInfoSection;
