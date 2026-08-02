import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-heading">
            <span className="line">FIND YOUR</span>
            <span className="line">PERFECT</span>
            <span className="line kicks">STYLE</span>
          </h1>
          <div className="hero-subtitle">ELEGANCE IN EVERY STITCH</div>
          <Link to="/sarees" className="hero-btn">Explore More</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;