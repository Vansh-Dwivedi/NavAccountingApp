import React from 'react';
import { Layout, Typography, Card, Collapse, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { FrontFooter } from './HeaderFooter';
import GetStartedSteps from './GetStartedSteps';
import Hero from './Hero';
import './Services.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const useStyles = createUseStyles({
  container: {
    minHeight: '100vh',
  },
  section: {
    padding: '40px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  serviceCard: {
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff !important',
    '& .ant-card-head': {
      backgroundColor: '#001529 !important',
      '& .ant-card-head-title': {
        color: '#fff !important',
        fontSize: '1.5rem !important',
        backgroundColor: '#001529 !important'
      }
    }
  },
  collapse: {
    backgroundColor: '#ffffff !important',
    '& .ant-collapse-item': {
      marginBottom: '0.5rem',
      border: '1px solid #f0f0f0',
      borderRadius: '4px !important',
      overflow: 'hidden',
      backgroundColor: '#ffffff !important'
    },
    '& .ant-collapse-header': {
      backgroundColor: '#f8f8f8 !important',
      fontWeight: 'bold'
    },
    '& .ant-collapse-content': {
      borderTop: '1px solid #f0f0f0',
      backgroundColor: '#ffffff !important'
    }
  },
  subCollapse: {
    marginTop: '0.5rem',
    '& .ant-collapse-item': {
      border: '1px solid #f5f5f5'
    },
    '& .ant-collapse-header': {
      backgroundColor: '#fafafa !important',
      padding: '8px 16px !important'
    }
  },
  serviceItem: {
    padding: '8px 16px',
    borderBottom: '1px solid #f5f5f5',
    '&:last-child': {
      borderBottom: 'none'
    }
  }
});

const Services = () => {
  const classes = useStyles();

  const servicesData = {
    'Accounting & Payroll': {
      description: 'Comprehensive financial management and payroll solutions for your business',
      sections: {
        'Accounting': {
          'Record Keeping': 'Accurate and systematic tracking of financial transactions',
          'Technology Integration': 'Utilizing software for efficient and accurate accounting processes',
          'Solution Oriented Financial Statements': 'Detailed financial reports for informed decision-making',
          'Strategic Financial Planning': 'Forward-thinking financial strategies for growth',
          'Financial Education': 'Empowering clients with financial knowledge'
        },
        'Payroll': {
          'Online Platform with Data Management': 'Secure digital payroll management system',
          'Convenient Payroll Calculations': 'Automated and accurate payroll processing',
          'Electronic Direct Deposit': 'Fast and secure payment transfers',
          'Payroll Tax Reporting assistance': 'Compliant tax documentation and filing',
          'New Hire Enrollment Package': 'Streamlined onboarding process',
          'Worker Comp Audit Assistance': 'Expert guidance for compliance',
          'Year End Tax Document assistance': 'Comprehensive tax preparation support'
        }
      }
    },
    'Taxation': {
      description: 'Expert tax services for businesses and individuals',
      items: {
        'Sales Tax Reporting': 'Accurate sales tax calculations and filing',
        'Payroll tax Reporting': 'Timely payroll tax management',
        'Tax income Reporting': 'Comprehensive income tax preparation',
        'Tax Planning Assistance': 'Strategic tax optimization guidance',
        'Tax Representation assistance': 'Professional tax advocacy services'
      }
    },
    'Compliance': {
      description: 'Ensuring your business meets all regulatory requirements',
      sections: {
        'Business Entity Focus': {
          'Business Entity Selection': 'Strategic entity structure guidance',
          'Business Entity Formation': 'Complete formation assistance',
          'Annually Licensing Renewals': 'Timely license management',
          'Updating Ownerships & Contact Reporting': 'Accurate ownership documentation',
          'Dissolution of Business Entity': 'Professional closure support',
          'BOI Reporting': 'Beneficial ownership compliance',
          'Corporation Meeting Minutes': 'Corporate record maintenance'
        },
        'Business Activity Focus': {
          Description: 'From Obtaining license, monthly/quarterly reporting and annual renewals',
          Categories: {
            'Retail & Food': {
              'Sales Tax Reporting': 'Regular tax compliance',
              'ABC License': 'Alcohol beverage licensing',
              'EBT License': 'Electronic benefits transfer setup',
              'Seller Permit License': 'State selling authorization',
              'Merchant Platform Assistance': 'Payment processing setup'
            },
            'Transportation': {
              'USDOT Certification': 'Department of Transportation compliance',
              'MC Number': 'Motor carrier authorization',
              'IFTA Certification': 'Fuel tax agreement compliance',
              'Clean Carb Vehicle Certification': 'Environmental compliance',
              'Road Tax Account Certification': 'Transportation tax management',
              'CA number': 'California operating authority',
              'MCP Number': 'Motor carrier permit',
              'EPN Number': 'Employer pull notice program',
              'Surety Bonds & etc.': 'Financial guarantee management'
            }
          }
        }
      }
    },
    'Business Insight & Advisory': {
      description: 'Strategic business guidance for growth and success',
      items: {
        'Business Tax Planning': 'Strategic tax optimization strategies',
        'Budgeting & Forecasting': 'Financial planning and projections',
        'Staff Control Decisions': 'Workforce management guidance',
        'Internal Control Planning': 'Risk management and controls',
        'Loan & Insurance assistance Financial Reporting': 'Financial documentation support',
        'Preliminary Business Plan analysis': 'Business strategy evaluation',
        'Business Valuation Analysis': 'Asset and business worth assessment'
      }
    }
  };

  const renderServiceItems = (items) => {
    return Object.entries(items).map(([key, value]) => {
      if (typeof value === 'object') {
        return (
          <Collapse 
            key={key} 
            className={classes.subCollapse}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Panel header={key}>
              {renderServiceItems(value)}
            </Panel>
          </Collapse>
        );
      }
      return (
        <div key={key} className={classes.serviceItem}>
          <p strong>{key}</p>
          {value && <p style={{ marginLeft: '8px' }}>- {value}</p>}
        </div>
      );
    });
  };

  return (
    <Layout>
      <Content>
        <div className={classes.container}>
          <Hero
            title="Our Services"
            description="Comprehensive financial solutions for your business"
            backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.jpg`}
          />
          <div className={classes.section} style={{ backgroundColor: '#ffffff !important' }}>
            <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
              {Object.entries(servicesData).map(([category, services]) => (
                <Col xs={24} key={category}>
                  <Card 
                    title={category}
                    className={classes.serviceCard}
                    style={{ backgroundColor: '#ffffff !important' }}
                  >
                    <p style={{ marginBottom: '1rem', color: '#000000 !important' }}>{services.description}</p>
                    {services.sections && (
                      <Collapse
                        className={classes.collapse}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      >
                        {Object.entries(services.sections).map(([section, items]) => (
                          <Panel header={section} key={section}>
                            {renderServiceItems(items)}
                          </Panel>
                        ))}
                      </Collapse>
                    )}
                    {services.items && (
                      <div>
                        {Object.entries(services.items).map(([item, description]) => (
                          <div key={item} className={classes.serviceItem}>
                            <p strong style={{ color: '#000000 !important' }}>{item}</p>
                            {description && <p style={{ marginLeft: '8px', color: "black" }}>- {description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {services.categories && (
                      <Collapse
                        className={classes.collapse}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      >
                        {Object.entries(services.categories).map(([category, items]) => (
                          <Panel header={category} key={category}>
                            {renderServiceItems(items)}
                          </Panel>
                        ))}
                      </Collapse>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <GetStartedSteps />
        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Services;