import React from 'react';
import { FaComments, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import './components.css';

const GetStartedSteps = () => {
  return (
    <div className="get-started-section">
      <h2>Get Started in 3 Simple Steps</h2>
      <p className="get-started-description">
        We've designed a streamlined 3-step process to ensure that we dedicate our time and expertise to individuals who are qualified and
        genuinely interested in implementing their tailored trust structure.
      </p>
      
      <div className="steps-container">
        <div className="step-card">
          <div className="step-icon">
            <FaComments />
          </div>
          <h3>Step 1</h3>
          <h4>Complete the Questionnaire</h4>
          <p>
            Begin by completing the quick questionnaire above to determine if the "Work For Your Buisness Entity" structure is the right fit
            for you and your business. Once you qualify, you can request a quick phone call, and one of our specialists will reach out
            within the next 24 hours.
          </p>
        </div>

        <div className="step-card">
          <div className="step-icon">
            <FaPhone />
          </div>
          <h3>Step 2</h3>
          <h4>5-Minute Phone Call</h4>
          <p>
            During this short phone call, we'll further assess if the "Work For Your Buisness Entity" structure fits your specific circumstances and
            can be tailored to your needs. If we determine that we can help you, you'll then be able to schedule a free 1:1 consultation
            where we'll tailor the structure to meet your personal and business goals.
          </p>
        </div>

        <div className="step-card">
          <div className="step-icon">
            <FaCalendarCheck />
          </div>
          <h3>Step 3</h3>
          <h4>Free 1:1 Consultation</h4>
          <p>
            During this consultation, you'll receive invaluable insights, a clear roadmap for implementation, and expert guidance to
            maximize both immediate and long-term benefits. We'll answer your questions and provide the information needed to
            confidently decide if the "Work For Your Buisness Entity" structure is right for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedSteps;
