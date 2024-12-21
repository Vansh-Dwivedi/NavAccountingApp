import React from 'react';
import { Card, List, Typography } from 'antd';
import './components.css';
import { FrontFooter, FrontHeader } from './FrontPage';

const { Title } = Typography;

const Resources = () => {
  const resourceLinks = [
    {
      category: 'IRS Links',
      links: [
        { title: 'IRS Online Account Setup (Personal)', url: 'https://api.id.me/en/registration/new' },
        { title: 'IRS Online Account Setup (Business)', url: 'https://api.id.me/en/registration/new' },
        { title: 'IRS Tax Refund', url: 'https://sa.www4.irs.gov/wmr/' },
        { title: 'IRS Personal Tax Payment', url: 'https://directpay.irs.gov/directpay/payment?execution=e1s1' },
        { title: 'IRS Business Tax Payment', url: 'https://directpay.irs.gov/directpay/businesspayment?execution=e3s1' },
        { title: 'IRS W4 Tax Withholding Calculator', url: 'https://apps.irs.gov/app/tax-withholding-estimator' },
      ]
    },
    {
      category: 'FTB Links',
      links: [
        { title: 'FTB Online Account Setup', url: 'https://webapp.ftb.ca.gov/MyFTBAccess/Registration/Terms' },
        { title: 'FTB Personal Tax Refund', url: 'https://webapp.ftb.ca.gov/refund/login?Submit=Check+refund&Lang=en-us' },
        { title: 'FTB Personal Tax Payment (Bank Direct Debit)', url: 'https://webapp.ftb.ca.gov/webpay/login/login?Submit=Use+Web+Pay+personal' },
        { title: 'FTB Business Tax Payment (Bank Direct Debit)', url: 'https://webapp.ftb.ca.gov/webpay/login/belogin?Submit=Use+Web+Pay+business' },
        { title: 'FTB Personal & Business Tax Payment (Credit Card)', url: 'https://www.officialpayments.com/pc_template_standard.jsp?body=pc_step2_body.jsp&OWASP_CSRFTOKEN=MT86-MI7S-0Z2Z-5UDH-ZQTG-XAZB-X2G0-Y034' },
      ]
    },
    {
      category: 'Covered California',
      links: [
        { title: 'Covered California Registration', url: 'https://apply.coveredca.com/static/lw-web/account-creation/choose-application' },
      ]
    }
  ];

  return (
    <>
      <FrontHeader />
      <div className="resources-container">
        <Title level={2} className="resources-title">Resources</Title>
        <div className="resources-grid">
          {resourceLinks.map((category, index) => (
            <Card key={index} title={category.category} className="resource-card">
              <List
                dataSource={category.links}
                renderItem={item => (
                  <List.Item>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </div>
      </div>
      <FrontFooter />
    </>
  );
};

export default Resources;
