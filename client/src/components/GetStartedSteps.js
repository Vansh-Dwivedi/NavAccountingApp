import React from 'react';
import { FaComments, FaPhone, FaCalendarCheck } from 'react-icons/fa';
import './components.css';

const GetStartedSteps = () => {
  return (
    <div className="get-started-section" style={{ zIndex: 9 }}>
      <h2 style={{ 
        color: '#002E6D', 
        fontWeight: 500, 
        marginBottom: '40px', 
        textAlign: 'center', 
        margin: '0 auto', 
        width: 'calc(100% - 55vw)',
        // mangolia script
        fontFamily: 'Magnolia Script'
      }}>
        Our Workflow
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
