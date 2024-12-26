import React from 'react';
import { Layout } from 'antd';
import './Footer.css';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="footer">
      <div className="footer-content">
        <div className="copyright">
          © 2019 Kalakaar Studios. All rights reserved.
        </div>
        <div className="developer-info">
          Developed by{' '}
          <a 
            href="https://kalakaar.co.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="developer-link"
          >
            Kalakaar Studios, Vansh Dwivedi
          </a>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
