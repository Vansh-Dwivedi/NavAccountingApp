import React from 'react';
import { FaComments, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import './components.css';

const GetStartedSteps = () => {
  return (
    <div className="get-started-section" style={{ zIndex: 9 }}>
      <h2 style={{ 
        color: '#ffffff', 
        fontWeight: 600, 
        marginBottom: '40px', 
        textAlign: 'center', 
        backgroundColor: '#000000', 
        margin: '0 auto', 
        width: 'calc(100% - 55vw)' 
      }}>
        Get Started - Our 3 step process
      </h2>

      <div className="steps-container" style={{ justifyContent: 'center !important', alignContent: 'center !important', alignItems: 'center !important', margin: '0 auto' }}>
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
