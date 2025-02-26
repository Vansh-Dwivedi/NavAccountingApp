import React, { useEffect } from 'react';
import { Layout, Typography, Card, Collapse, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';
import { FrontFooter } from './HeaderFooter';
import GetStartedSteps from './GetStartedSteps';
import Hero from './Hero';
import './Services.css';
// Schedule Meeting Import
import VirtualMeetingSection from './VirtualMeetingSection';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const useStyles = createUseStyles({
  container: {
    minHeight: '100vh',
  },
  section: {
    padding: '40px 0',
    backgroundColor: '#f5f5f5',
  },
  servicesContainer: {
    padding: '40px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  serviceSection: {
    marginBottom: '6rem',
    scrollMarginTop: '100px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    color: '#002E6D',
    marginBottom: '2rem',
    fontFamily: 'Magnolia Script',
    textAlign: 'center',
  },
  serviceCard: {
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    backgroundColor: '#fff',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    }
  },
  serviceDescription: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '2rem',
    padding: '0 1rem',
  },
  collapse: {
    backgroundColor: '#fff',
    border: 'none',
    '& .ant-collapse-item': {
      borderBottom: '1px solid #eee',
      marginBottom: '1rem',
      '&:last-child': {
        borderBottom: 'none',
      }
    },
    '& .ant-collapse-header': {
      color: '#002E6D !important',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      padding: '1rem !important',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px !important',
      '&:hover': {
        backgroundColor: '#f0f2f5',
      }
    },
    '& .ant-collapse-content': {
      borderTop: 'none',
    },
    '& .ant-collapse-content-box': {
      padding: '1.5rem !important',
    }
  },
  serviceItem: {
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    backgroundColor: '#f8f9fa',
    '& p': {
      margin: 0,
      color: '#333 !important',
      '&:first-child': {
        fontWeight: 'bold',
        marginBottom: '0.5rem',
      }
    },
    '&:hover': {
      backgroundColor: '#f0f2f5',
    }
  }
});

const Services = () => {
  const classes = useStyles();

  const getSafeId = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  useEffect(() => {
    // Scroll to section if hash is present in URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the # and decode the hash
      const decodedHash = decodeURIComponent(hash.substring(1));
      // Convert to safe ID format
      const safeId = getSafeId(decodedHash);
      const element = document.getElementById(safeId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  const servicesData = {
    'accounting-payroll': {
      title: 'Accounting & Payroll Services',
      description: 'Comprehensive accounting and payroll management solutions for your business',
      sections: {
        'Accounting': {
          'Bookkeeping': 'Monthly, Quarterly, and Annual bookkeeping services',
          'Financial Statement Preparation': 'Professional preparation of financial statements',
          'Cash Flow Management & Budgeting': 'Strategic financial planning and budgeting',
          'Accounting System Setup & Cleanup': 'Implementation and optimization of accounting systems',
        },
        'Payroll': {
          'Payroll Processing': 'Weekly, Bi-weekly, and Monthly payroll processing',
          'Payroll Tax Filings': '941, 940, DE9, DE9C, and other tax filings',
          'Direct Deposits & Paycheck Preparation': 'Efficient payment processing',
          'Employee & Contractor Payments': 'W-2 & 1099 Processing',
          'New Hire Reporting & Compliance': 'Complete onboarding compliance',
          'Payroll Tax Calculation & Withholding': 'Accurate tax management',
          'Payroll Audit Support & Compliance': 'Expert audit assistance',
          'Workers\' Compensation Reporting': 'Comprehensive workers\' comp management',
          'Year-End Payroll Reporting': 'W-2s and 1099s preparation and filing'
        }
      }
    },
    'taxation': {
      title: 'Taxation',
      description: 'Expert tax services and compliance solutions',
      sections: {
        'Individual Tax Services': {
          '1040 Preparation & Filing': 'Including 1040NR, 1040X, 1040SR',
          'Tax Planning & Projections': 'Strategic tax planning and forecasting',
          'Amended Tax Returns': 'Correction and filing of amended returns',
          'IRS Representation & Audits': 'Professional representation and support',
          'Tax Resolution Services': 'Offer in Compromise, Installment Agreements, Penalty Abatement',
          'Foreign Income & FBAR Compliance': 'International tax compliance'
        },
        'Business Tax Services': {
          'Self-Employed & Freelancers Tax Preparation': 'Specialized tax services for independent contractors',
          'Corporate Tax Filing': '1120 and 1120S preparation and filing',
          'Partnership Tax Returns': '1065 preparation and filing',
          'LLC & Sole Proprietor Tax Compliance': 'Complete business tax compliance',
          'Quarterly Estimated Tax Payments': 'Tax planning and payment scheduling',
          'State & Local Business Tax Filings': 'Multi-jurisdiction tax compliance'
        }
      }
    },
    'compliance': {
      title: 'Compliance',
      description: 'Industry-specific compliance and regulatory solutions',
      sections: {
        'Retail Industry Focus': {
          'Business Entity Formation': 'Complete formation and setup services',
          'Business Licenses & Permits': 'State, County, and City licensing',
          'Sellers Permit & Resale Certificate': 'Sales tax compliance',
          'Alcohol & Tobacco License': 'Specialized retail licensing',
          'FDA & Health Code Compliance': 'Food & beverage retailer compliance'
        },
        'Logistics & Trucking Focus': {
          'DOT & FMCSA Compliance': 'Transportation regulatory compliance',
          'DOT Number & MC Authority': 'Transportation licensing and permits',
          'Unified Carrier Registration': 'UCR compliance and filing',
          'Biennial DOT Updates': 'MCS-150 maintenance',
          'FMCSA Compliance & Safety Audits': 'Safety regulation compliance',
          'Drug & Alcohol Testing Program': 'DOT Consortium compliance',
          'Driver Qualification Management': 'Complete DQ file management',
          'EPN & Clearing House': 'Employment screening compliance',
          'IFTA & Fuel Tax Compliance': 'Fuel tax management and reporting'
        }
      }
    },
    'business-advisory': {
      title: 'Business Insight & Advisory Services',
      description: 'Strategic business planning and growth solutions',
      sections: {
        'Financial Advisory': {
          'Financial Planning & Analysis': 'Comprehensive financial planning',
          'Cash Flow & Profitability Analysis': 'Performance optimization',
          'Budgeting & Forecasting': 'Strategic financial projections',
          'Business Valuation': 'Growth strategies and valuation',
          'Cost Reduction & Efficiency': 'Operational optimization'
        },
        'Strategic Planning': {
          'Tax Strategy & Planning': 'Tax optimization strategies',
          'Entity Selection & Structuring': 'LLC, S-Corp, C-Corp consultation',
          'Multi-State & Federal Compliance': 'Cross-jurisdiction advisory',
          'IRS Audit Support': 'Tax resolution services',
          'Business Grants': 'Grant application assistance'
        }
      }
    }
  };

  const renderServiceItems = (items) => {
    return Object.entries(items).map(([key, value]) => {
      if (typeof value === 'object') {
        return (
          <Collapse 
            key={key} 
            className={classes.collapse}
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
            backgroundImage={`${process.env.REACT_APP_API_URL}/uploads/common-hero.png`}
          />
          <div className={classes.servicesContainer}>
            {Object.entries(servicesData).map(([id, service]) => (
              <section key={id} id={id} className={classes.serviceSection}>
                <h2 className={classes.sectionTitle}>{service.title}</h2>
                <Card 
                  className={classes.serviceCard}
                >
                  <p className={classes.serviceDescription}>{service.description}</p>
                  {service.sections && (
                    <Collapse
                      className={classes.collapse}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    >
                      {Object.entries(service.sections).map(([section, items]) => (
                        <Panel header={section} key={section}>
                          {renderServiceItems(items)}
                        </Panel>
                      ))}
                    </Collapse>
                  )}
                  {service.items && (
                    <div>
                      {Object.entries(service.items).map(([item, description]) => (
                        <div key={item} className={classes.serviceItem}>
                          <p strong style={{ color: '#333 !important' }}>{item}</p>
                          {description && <p style={{ marginLeft: '8px', color: "black" }}>- {description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {service.categories && (
                    <Collapse
                      className={classes.collapse}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    >
                      {Object.entries(service.categories).map(([category, items]) => (
                        <Panel header={category} key={category}>
                          {renderServiceItems(items)}
                        </Panel>
                      ))}
                    </Collapse>
                  )}
                </Card>
              </section>
            ))}
          </div>
          {/* FAQ Section */}
          <div style={{ 
            padding: '80px 0',
            backgroundColor: '#f8f9fa',
            marginBottom: '40px'
          }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
              <Typography.Title 
                level={2} 
                style={{ 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  color: '#002E6D',
                  fontSize: '36px',
                  fontWeight: '600'
                }}
              >
                Frequently Asked Questions
              </Typography.Title>
              
              <Typography.Paragraph
                style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  color: '#666',
                  marginBottom: '40px',
                  maxWidth: '700px',
                  margin: '0 auto 40px'
                }}
              >
                Find quick answers to common questions about our services, processes, and team
              </Typography.Paragraph>

              <Collapse 
                defaultActiveKey={['1']} 
                expandIconPosition="end"
                bordered={false}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>Are you guys accepting new clients?</span>} 
                  key="1"
                >
                  <p style={{ margin: 0 }}>Yes we are.</p>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>How long does it take to Final Reports for Taxes?</span>}
                  key="2"
                >
                  <p style={{ margin: 0 }}>For Simple taxes with complete information take 3 business days.</p>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>What kind of information do you need to prepare Taxes?</span>}
                  key="3"
                >
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>Past 2 years Tax Returns</li>
                    <li>Residency Proof</li>
                    <li>All current year income and tax documents</li>
                    <li>For specific Business activity focus expense sheets, please find them under resource tab</li>
                  </ul>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>Do you guys electronically file taxes?</span>}
                  key="4"
                >
                  <p style={{ margin: 0 }}>Yes, we are authorized to ERO.</p>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>What other services do you offer besides Taxes?</span>}
                  key="5"
                >
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>Monthly Accounting</li>
                    <li>Preparation of Payroll Check stubs & Tax Reporting</li>
                    <li>Annual 1099 and W2 Preparation to E-Filing</li>
                    <li>New Business Formations</li>
                    <li>Business Licensing</li>
                    <li>Tax letters assistance representations</li>
                  </ul>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>Do you have bilingual staff?</span>}
                  key="6"
                >
                  <p style={{ margin: 0 }}>Yes, our staff fluently speaks:</p>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '20px' }}>
                    <li>Hindi</li>
                    <li>English</li>
                    <li>Punjabi</li>
                    <li>Spanish</li>
                  </ul>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>How can I make payment for my invoice?</span>}
                  key="7"
                >
                  <p style={{ margin: '0 0 10px' }}>We accept multiple payment methods:</p>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>Checks</li>
                    <li>Zelle</li>
                    <li>Venmo</li>
                    <li>Credit Card Payments</li>
                  </ul>
                  <p style={{ margin: '10px 0 0' }}>Please use the "Make a payment" button for your convenience.</p>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>Are you currently hiring?</span>}
                  key="8"
                >
                  <p style={{ margin: 0 }}>Yes, we would be happy to have your Resume. Please keep checking our Employment Page for upcoming Job postings.</p>
                </Collapse.Panel>

                <Collapse.Panel 
                  header={<span style={{ fontWeight: 500 }}>How do you determine service charges?</span>}
                  key="9"
                >
                  <p style={{ margin: 0 }}>Our service charges are based on your total gross income annually.</p>
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>

          {/* Get Started Steps Section */}
          <GetStartedSteps />
          <VirtualMeetingSection />
          <div style={{ height: '100px' }}></div>

        </div>
      </Content>
      <FrontFooter />
    </Layout>
  );
};

export default Services;