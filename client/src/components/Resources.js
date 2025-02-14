import React from 'react';
import { Layout, Card, List, Typography, Row, Col, Space } from 'antd';
import {
  FileOutlined,
  BankOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  IdcardOutlined,
  CarOutlined,
  ShopOutlined,
  CalculatorOutlined,
  AuditOutlined
} from '@ant-design/icons';
import './Resources.css';
import { FrontHeader, FrontFooter } from './HeaderFooter';
import PaymentHeader from './PaymentHeader';
import Hero from './Hero';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Resources = () => {
  const resourcesData = {
    irs: {
      title: "IRS Resources",
      icon: <BankOutlined className="resource-icon" />,
      description: "Official IRS services and tools for tax management",
      links: [
        { text: "Personal Online Account", url: "https://www.irs.gov/payments/your-online-account", icon: <IdcardOutlined /> },
        { text: "Business Online Account", url: "https://www.irs.gov/payments/view-your-tax-account", icon: <SafetyCertificateOutlined /> },
        { text: "Make a Payment", url: "https://www.irs.gov/payments", icon: <DollarOutlined /> },
        { text: "Schedule an Appointment", url: "https://apps.irs.gov/app/office-locator/", icon: <CalculatorOutlined /> },
        { text: "Tax Refund Status", url: "https://www.irs.gov/refunds", icon: <AuditOutlined /> }
      ]
    },
    ftb: {
      title: "California FTB Resources",
      icon: <GlobalOutlined className="resource-icon" />,
      description: "California state tax resources through the Franchise Tax Board",
      links: [
        { text: "MyFTB Account Access", url: "https://www.ftb.ca.gov/myftb/", icon: <IdcardOutlined /> },
        { text: "Make a Payment", url: "https://www.ftb.ca.gov/pay/", icon: <DollarOutlined /> },
        { text: "Check Refund Status", url: "https://www.ftb.ca.gov/refund/", icon: <AuditOutlined /> },
        { text: "Business Services", url: "https://www.ftb.ca.gov/businesses/", icon: <ShopOutlined /> }
      ]
    },
    healthcare: {
      title: "Healthcare & Employment",
      icon: <MedicineBoxOutlined className="resource-icon" />,
      description: "Access healthcare and employment resources",
      links: [
        { text: "Covered California", url: "https://www.coveredca.com/", icon: <SafetyCertificateOutlined /> },
        { text: "EDD Services", url: "https://www.edd.ca.gov/", icon: <IdcardOutlined /> },
        { text: "UI Online", url: "https://www.edd.ca.gov/unemployment/", icon: <GlobalOutlined /> }
      ]
    },
    business: {
      title: "Business Resources",
      icon: <ShopOutlined className="resource-icon" />,
      description: "Essential business compliance resources",
      links: [
        { text: "Secretary of State Business Portal", url: "https://bizfile.sos.ca.gov/", icon: <SafetyCertificateOutlined /> },
        { text: "CDTFA Tax Service", url: "https://www.cdtfa.ca.gov/", icon: <DollarOutlined /> },
        { text: "DMV Commercial Services", url: "https://www.dmv.ca.gov/portal/vehicle-industry-services/", icon: <CarOutlined /> }
      ]
    }
  };

  const ResourceSection = ({ title, icon, description, links }) => (
    <Card 
      className="resource-card"
      style={{ backgroundColor: '#ffffff !important' }}
    >
      <div className="resource-header">
        {icon}
        <Title level={3} style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>
          {title}
        </Title>
      </div>
      <Paragraph className="resource-description" style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>
        {description}
      </Paragraph>
      <List
        className="resource-list"
        dataSource={links}
        renderItem={item => (
          <List.Item>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="resource-link">
              <Space>
                {item.icon}
                <span style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}>{item.text}</span>
                <ArrowRightOutlined className="arrow-icon" />
              </Space>
            </a>
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <Layout className="layout" style={{ backgroundColor: '#ffffff !important' }}>
      <PaymentHeader />
      <FrontHeader activeKey="/resources" />
      <Content style={{ backgroundColor: '#ffffff !important' }}>
        <Hero
          title="Resources & Tools"
          description="Access official government resources, tax tools, and business services all in one place."
          backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.jpg`}
          needMargin={true}
        />
        <section className="resources-grid" style={{ backgroundColor: '#ffffff !important' }}>
          <Row gutter={[32, 32]}>
            {Object.entries(resourcesData).map(([key, section]) => (
              <Col xs={24} md={12} key={key}>
                <ResourceSection
                  title={section.title}
                  icon={section.icon}
                  description={section.description}
                  links={section.links}
                />
              </Col>
            ))}
          </Row>
        </section>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Resources;
