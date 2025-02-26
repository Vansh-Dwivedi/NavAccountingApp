import React, { useState } from 'react';
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
      title: "Forms Link",
      icon: <FileOutlined className="resource-icon" />,
      description: "Essential business compliance resources",
      links: [
        { text: "Interview Form - Individual Taxes", url: "https://drive.google.com/file/d/1dIVJSDMdQnbr6EdhJ8RKwD7JpxSSl_rT/view", icon: <FileOutlined /> },
        { text: "Interview Form - Buisness Entity Taxes", url: "https://drive.google.com/file/d/1EkYTaKSoJhY0BW98Nbm0Tt8mMy3kQiox/view", icon: <FileOutlined /> },
        { text: "2024 Tax Rates & Limits", url: "https://drive.google.com/file/d/1Y4PUzIX_uBb3cfnxe9AkuwpK-cOpN_tj/view", icon: <FileOutlined /> },
        { text: "Business Formation", url: "https://drive.google.com/file/d/1DR7Z2vROYC1hinHpn_fbVCFxUiUOPaOV/view?usp=sharing", icon: <FileOutlined /> },
        { text: "Trucking Business Expenses Sheet", url: "https://drive.google.com/file/d/1G5GWmwb9ZLLv68lvI4ac8CVYkKqUA8VZ/view", icon: <FileOutlined /> },
        { text: "Freelancer Expense Sheet", url: "https://drive.google.com/file/d/1v4bUVKZh3X__VFDF0Ap1bf766TV4Rh4R/view", icon: <FileOutlined /> }
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

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Layout className="layout" style={{ backgroundColor: '#ffffff !important' }}>
      <PaymentHeader />
      <FrontHeader activeKey="/resources" />
      <Content style={{ backgroundColor: '#ffffff !important' }}>
        <Hero
          title="Resources & Tools"
          description="Access official government resources, tax tools, and business services all in one place."
          backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.png`}
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
        <section className="faq-section" style={{ backgroundColor: '#f5f5f5', padding: '60px 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#1890ff' }}>
              Frequently Asked Questions
            </h2>
            <div className="faq-container">
              <div className="accordion">
                {[
                  {
                    question: 'I need assistance with setup my online IRS Account?',
                    answer: 'Requested Weblink reference is available under business resource tab. Thank you!'
                  },
                  {
                    question: 'I need assistance with setup my online Franchise Tax Board Account?',
                    answer: 'Requested Weblink reference is available under business resource tab. Thank you!'
                  },
                  {
                    question: 'I need assistance with setup my online California Unemployment Claim Insurance Account?',
                    answer: 'Requested Weblink reference is available under business resource tab. Thank you!'
                  },
                  {
                    question: 'I need assistance with get access to Medical Tax Form with Covered California?',
                    answer: 'Requested Weblink reference is available under business resource tab. Thank you!'
                  }
                ].map((faq, index) => (
                  <div className="accordion-item" key={index}>
                    <button
                      className={`accordion-button ${expandedIndex === index ? 'active' : ''}`}
                      onClick={() => handleAccordionClick(index)}
                    >
                      {faq.question}
                      <span className="accordion-icon">{expandedIndex === index ? '−' : '+'}</span>
                    </button>
                    <div className={`accordion-content ${expandedIndex === index ? 'active' : ''}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Resources;
