import React from "react";
import { motion } from "framer-motion";
import {
  Layout,
  Card,
  Row,
  Col,
  Collapse,
  Button,
  Carousel,
} from "antd";
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
  SolutionOutlined,
  BookOutlined,
  CarOutlined,
  ShopOutlined,
  UserOutlined,
  CreditCardOutlined,
  BuildOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FrontHeader, FrontFooter } from './FrontPage';
import { useLocation } from 'react-router-dom';
import './Services.css';

const { Content } = Layout;
const { Panel } = Collapse;

const Services = () => {
  const location = useLocation();
  const services = [
    {
      title: "Accounting & Assurance",
      icon: <BankOutlined className="service-icon" />,
      description: "Transform your financial management with our comprehensive accounting solutions",
      subServices: [
        {
          title: "Manual 2 Digital Bookkeeping Services",
          icon: <BookOutlined />,
          details: "Experience seamless transition from traditional to digital bookkeeping with our expert guidance and modern tools",
        },
        {
          title: "Bank Reconciliation",
          icon: <CreditCardOutlined />,
          details: "Ensure accuracy and prevent fraud with our thorough bank reconciliation services, keeping your financial records pristine",
        },
        {
          title: "Quarterly, Monthly Financial Statements",
          icon: <FileProtectOutlined />,
          details: "Get detailed insights into your business performance with our professionally prepared financial statements",
        },
        {
          title: "GAAP Compliance assistance",
          icon: <CheckCircleOutlined />,
          details: "Stay compliant with the latest accounting standards while maintaining transparency in financial reporting",
        },
        {
          title: "Control over Monthly vendor payments",
          icon: <DollarOutlined />,
          details: "Optimize your cash flow with our structured vendor payment management system",
        },
      ],
    },
    {
      title: "Payroll",
      icon: <TeamOutlined className="service-icon" />,
      description: "Streamline your payroll processes with our comprehensive management solutions",
      subServices: [
        {
          title: "Printed Pay stub payroll checks",
          icon: <FileProtectOutlined />,
          details: "Professional, accurate, and timely printed payroll checks with detailed pay stubs for your employees",
        },
        {
          title: "Free Direct Deposit",
          icon: <CreditCardOutlined />,
          details: "Convenient and secure electronic payment system at no additional cost",
        },
        {
          title: "Online Payroll Manager",
          icon: <SettingOutlined />,
          details: "Access your payroll system 24/7 with our user-friendly online platform",
        },
        {
          title: "HR Package",
          icon: <UserOutlined />,
          details: "Comprehensive HR solutions including employee management, benefits administration, and compliance",
        },
        {
          title: "Specialized Payroll Calculation",
          icon: <CalculatorOutlined />,
          details: "Expert handling of complex payroll scenarios including family employees, officer salaries, and specialized industry requirements",
        },
        {
          title: "Annual Tax Form preparation",
          icon: <FileSearchOutlined />,
          details: "Complete preparation and filing of all required tax forms including W-2s, 1099s, and other year-end documentation",
        },
      ],
    },
    {
      title: "Taxation",
      icon: <CalculatorOutlined className="service-icon" />,
      description: "Expert tax planning and compliance services",
      subServices: [
        {
          title: "Tax Preparation",
          icon: <FileSearchOutlined />,
          subItems: [
            "Individual Taxes (Form 1040, 1040NR, 1040SR)",
            "Business Taxes (Form 1065, 1120, 1120S)",
            "Tax Letter Assistance",
            "Multiple interaction platforms available",
            "Tax Payment assistance",
            "Document collection assistance",
            "Electronic filing assistance",
          ],
        },
        {
          title: "Tax Planning",
          icon: <BarChartOutlined />,
          details: "Tax Saving Strategies application based on case scenario",
        },
        {
          title: "Tax Representation",
          icon: <SolutionOutlined />,
          subItems: [
            "Non-Filer Tax Returns assistance",
            "Tax Letter Assistance",
            "Offer of Compromise Assistance",
            "Various Tax Transcript assistance",
          ],
        },
      ],
    },
    {
      title: "Business Operational Compliance",
      icon: <SafetyCertificateOutlined className="service-icon" />,
      description: "Industry-specific compliance solutions",
      subServices: [
        {
          title: "Retail Industry Focus",
          icon: <ShopOutlined />,
          subItems: [
            "Sales Tax Account setup & management",
            "Assessor Forms",
            "Third-party document preparation",
            "City, County, Business Licensing renewal",
          ],
        },
        {
          title: "Transportation Industry Focus",
          icon: <CarOutlined />,
          subItems: [
            "Carb Registration & Renewals Certification",
            "IFTA account management",
            "OR Road Tax Reporting & Renewals",
            "Highway Taxes Reporting",
            "UCR, MC#, & US DOT applications",
            "Various State permits",
            "MCP Registration",
            "California CA registration",
            "BOC-3 Filing",
            "W9 Form application",
          ],
        },
      ],
    },
    {
      title: "Business Insights & Advisory",
      icon: <BuildOutlined className="service-icon" />,
      description: "Strategic business consulting and growth solutions",
      subServices: [
        {
          title: "Client & Business Management",
          icon: <UserOutlined />,
          subItems: [
            "Onboarding Client Interactions",
            "Company Agreement Templates",
            "Cost Reduction Strategies",
            "Employee Cost Control Strategies",
          ],
        },
        {
          title: "Business Development",
          icon: <BarChartOutlined />,
          subItems: [
            "Authorities' compliance operation policies",
            "Business Entity Selection and Formation",
            "Licensing & Authority Representation",
            "Business projection reporting and analysis",
          ],
        },
      ],
    },
  ];

  // Generate array of image URLs
  const carouselImages = Array.from({ length: 11 }, (_, i) => `https://ec2-54-241-155-145.us-west-1.compute.amazonaws.com:8443/uploads/${i + 1}.png`);

  return (
    <Layout className="layout">
      <FrontHeader activeKey="/services" />
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>

        <div className="services-container">
          <motion.div
            className="services-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Services</h1>
            <p className="services-intro">
              At Nav Accounts, we offer comprehensive accounting and financial services tailored to meet your specific business needs.
              Our expert team provides end-to-end solutions from basic bookkeeping to complex business advisory services.
            </p>
          </motion.div>

          {/* Image Carousel */}
          <div style={{ 
            maxWidth: '800px', 
            margin: '40px auto',
            padding: '0 20px'
          }}>
            <Carousel autoplay>
              {carouselImages.map((imageUrl, index) => (
                <div key={index} style={{ 
                  padding: '20px',
                  background: '#f5f5f5',
                  borderRadius: '12px',
                }}>
                  <img
                    src={imageUrl}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: '600px',
                      height: '850px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      margin: '0 auto',
                      display: 'block',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <motion.div
            className="services-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="service-card">
                  <div className="service-header">
                    {service.icon}
                    <h2>{service.title}</h2>
                  </div>
                  <p>{service.description}</p>
                  <Collapse className="service-collapse">
                    {service.subServices.map((subService, subIndex) => (
                      <Panel
                        header={
                          <div className="subservice-header">
                            {subService.icon}
                            <span>{subService.title}</span>
                          </div>
                        }
                        key={subIndex}
                      >
                        {subService.details && (
                          <p className="subservice-details">{subService.details}</p>
                        )}
                        {subService.subItems && (
                          <ul className="subservice-list">
                            {subService.subItems.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <CheckCircleOutlined /> {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Panel>
                    ))}
                  </Collapse>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Services;