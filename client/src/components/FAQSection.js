import React from 'react';
import { Collapse, Typography } from 'antd';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title } = Typography;

const StyledCollapse = styled(Collapse)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;

  .ant-collapse-header {
    font-weight: 500 !important;
  }

  .ant-collapse-content-box {
    padding: 16px 24px !important;
  }
`;

const FAQSection = () => {
  const faqs = [
    {
      question: "Are you guys accepting new clients?",
      answer: "Yes we are."
    },
    {
      question: "How long does it take to Final Reports for Taxes?",
      answer: "Tax Returns are split into 3 categories, Individual Taxes Basic, Individual Taxes Advance, Profit Focus Business Taxes. For Basic Individual Taxes with complete information takes 48 hours max, Advance individual taxes take a week same with business taxes. This timing applies to complete information. With missing information timing may vary."
    },
    {
      question: "What kind of information do you need to prepare Taxes with your team?",
      answer: "Previously filed tax returns for past 2 years in both case scenarios – for individuals or business entity taxes, plus taxpayers/ entity owners associated with residency proof – DMV ID/Driving License, Latest Passport Copy, Green Card, ITIN Letter, Legal documents of business entity – in case of applicable; Please fill out interview sheet/ business activity Expense Sheet, available to download under Business Resources Tab."
    },
    {
      question: "Do you guys electronically file taxes?",
      answer: "Yes, we are authorized to ERO."
    },
    {
      question: "Do you guys offer another service than Taxes?",
      answer: "Yes, we all offer Monthly Accounting, Preparation of Payroll Check stubs & Tax Reporting, annually 1099, w2 Preparation to E-Filing, After Tax Service related to associated with Tax Letters representation also offered."
    },
    {
      question: "Do you guys have bilingual staff?",
      answer: "We have staff fluently speaks – Hindi, English, Punjabi, Spanish."
    },
    {
      question: "How to make payment for my invoice?",
      answer: "We accept Checks, Zelle, Venmo, Credit Card Payments; kindly please use Make a payment button. Thank you!"
    },
    {
      question: "Are you guys hiring?",
      answer: "Yes, we would be happy to have you Resume in, keep checking on Employment Page – upcoming Job posting."
    },
    {
      question: "How do you charge for services?",
      answer: "Based on your gross annual income, our invoicing structure varies in Package Tax Care & Tax Advisor. There is one time fees charges service if you use Tax Care Package & Monthly Invoice under Tax Advisor Package."
    },
    {
      question: "How does the Virtual Meeting work?",
      answer: "For all those clients, who are distance, need assistance with their business financial matters, and interested to outsourcing services, but would like to have meet up to know are we real professional people, there you go schedule the meeting clicking on this button. Let's connect. Our Solutions to your concerns."
    }
  ];

  return (
    <div style={{ padding: '40px 0', zIndex: 2 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
        Frequently Asked Questions
      </Title>
      <StyledCollapse 
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <QuestionCircleOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        {faqs.map((faq, index) => (
          <Panel header={faq.question} key={index}>
            <p>{faq.answer}</p>
          </Panel>
        ))}
      </StyledCollapse>
    </div>
  );
};

export default FAQSection;
