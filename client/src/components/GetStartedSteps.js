import React from 'react';
import { FaComments, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import './components.css';

const GetStartedSteps = () => {
  return (
    <div className="get-started-section" style={{ zIndex: 9 }}>
      <h2>Get Started - Our 3 step process</h2>
      <p className="get-started-description">
        We've designed a streamlined 3-step process to ensure that we dedicate our time and expertise to individuals who are qualified and
        genuinely interested in implementing their tailored trust structure.
      </p>

      <div className="steps-container" style={{ justifyContent: 'center !important' }}>
        <div className="step-card">
          <h4>Connect</h4>
          <p>
            Schedule your appointment through our right time works for you over the phone call.
          </p>
        </div>

        <div className="step-card">
          <h4>Identify</h4>
          <p>
            Claim your first 30 minutes session for free, charges applied after 30 minutes session. Discuss your situation.
          </p>
        </div>

        <div className="step-card">
          <h4>Optimize</h4>
          <p>
            We will assist you with  our best service option applicable based your situation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedSteps;
