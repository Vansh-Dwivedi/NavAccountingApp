import React from 'react';
import PropTypes from 'prop-types';
import './Hero.css';

const Hero = ({ title, description, backgroundImage, needMargin }) => (
  needMargin ? (
    <section className="showcase-container" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: '-180px' }}>
      <div className="showcase-background-dim"></div>
      <div className="showcase-wrapper">
        <h1 className="showcase-heading">{title}</h1>
        <p className="showcase-description">{description}</p>
      </div>
    </section>
  ) : (
    <section className="showcase-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="showcase-background-dim"></div>
      <div className="showcase-wrapper">
        <h1 className="showcase-heading">{title}</h1>
        <p className="showcase-description">{description}</p>
      </div>
    </section>
  ));

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired
};

export default Hero;