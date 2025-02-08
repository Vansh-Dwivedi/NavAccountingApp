import React from 'react';
import PropTypes from 'prop-types';
import './Hero.css';

const Hero = ({ title, description, backgroundImage }) => (
  <section className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="hero-overlay"></div>
    <div className="hero-content">
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{description}</p>
    </div>
  </section>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired
};

export default Hero;