import React from "react";
import { Layout, Card, Row, Col, Typography, Carousel } from "antd";
import {
  BankOutlined,
  AuditOutlined,
  DollarOutlined,
  FileProtectOutlined,
  CalculatorOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { FrontHeader, FrontFooter } from './Header&Footer';
import "./Services.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const Services = () => {
  const carouselImages = [
    { src: 'https://localhost:8443/uploads/1.png', alt: 'Service 1' },
    { src: 'https://localhost:8443/uploads/2.png', alt: 'Service 2' },
    { src: 'https://localhost:8443/uploads/3.png', alt: 'Service 3' },
    { src: 'https://localhost:8443/uploads/4.png', alt: 'Service 4' },
    { src: 'https://localhost:8443/uploads/5.png', alt: 'Service 5' },
    { src: 'https://localhost:8443/uploads/6.png', alt: 'Service 6' },
    { src: 'https://localhost:8443/uploads/7.png', alt: 'Service 7' },
    { src: 'https://localhost:8443/uploads/8.png', alt: 'Service 8' },
    { src: 'https://localhost:8443/uploads/9.png', alt: 'Service 9' }
  ];

  const services = [
    {
      icon: <BankOutlined className="service-icon" />,
      title: "Business Formation",
      description: "Complete business formation and registration services",
      features: [
        "Entity Selection",
        "State Registration",
        "EIN Registration",
        "Compliance Setup"
      ]
    },
    {
      icon: <AuditOutlined className="service-icon" />,
      title: "Tax Services",
      description: "Comprehensive tax planning and preparation",
      features: [
        "Tax Planning",
        "Return Preparation",
        "IRS Representation",
        "Tax Resolution"
      ]
    },
    {
      icon: <CalculatorOutlined className="service-icon" />,
      title: "Accounting",
      description: "Professional accounting and bookkeeping",
      features: [
        "Bookkeeping",
        "Financial Statements",
        "Payroll Services",
        "CFO Services"
      ]
    }
  ];

  return (
    <Layout className="layout">
      <FrontHeader />
      <Content>
        <div className="services-container">
          <section className="services-slider">
            <Carousel autoplay>
              {carouselImages.map((image, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <img src={image.src} alt={image.alt} style={{ width: '100%', maxWidth: '900px', height: 'auto' }} />
                </div>
              ))}
            </Carousel>
          </section>

          <section className="services-section">
            <Title level={2} className="section-title">Our Services</Title>
            <Row gutter={[24, 24]}>
              {services.map((service, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card className="service-card" hoverable>
                    {service.icon}
                    <Title level={4} className="service-title">{service.title}</Title>
                    <Text className="service-description">{service.description}</Text>
                    <ul className="service-features">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="service-feature-item">
                          <p style={{ display: 'inline-block', marginRight: '8px', marginBottom: '0', fontSize: '1rem', fontWeight: '500', color: 'rgba(0, 0, 0, 0.85)' }}>{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          <section className="tax-returns-section">
            <div className="tax-returns-content">
              <img 
                src="https://localhost:8443/uploads/tax-returns-50.png" 
                alt="Tax Returns Services" 
                className="tax-returns-image"
              />
            </div>
          </section>

        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Services;