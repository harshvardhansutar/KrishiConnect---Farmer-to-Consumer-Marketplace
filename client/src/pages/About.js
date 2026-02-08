import React from 'react';
import { Link } from 'react-router-dom';
import { FaTarget, FaEye, FaHandshake, FaChartLine } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About KrishiConnect</h1>
          <p className="hero-description">
            Bridging the gap between farmers and consumers for a sustainable agricultural future
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="content-section">
            <h2>Our Vision</h2>
            <p>
              To create a transparent, fair, and sustainable agricultural marketplace where farmers 
              receive fair compensation for their hard work and consumers get access to fresh, 
              quality produce directly from the source.
            </p>
          </div>

          <div className="content-section">
            <h2>Our Mission</h2>
            <p>
              KrishiConnect aims to eliminate middlemen from the agricultural supply chain, 
              ensuring that farmers get better prices for their produce while consumers enjoy 
              fresh, affordable products. We believe in empowering farmers and building a 
              community that values transparency and fairness.
            </p>
          </div>

          <div className="problem-section">
            <h2>The Problem We Solve</h2>
            <div className="problem-card">
              <h3>Middlemen Exploitation</h3>
              <p>
                Traditional agricultural supply chains involve multiple middlemen who take 
                significant cuts, leaving farmers with minimal profits despite their hard work. 
                This exploitation has been a long-standing issue affecting millions of farmers 
                across India.
              </p>
            </div>
            <div className="problem-card">
              <h3>Price Disparity</h3>
              <p>
                Consumers often pay high prices for produce, but farmers receive only a fraction 
                of that amount. This price disparity benefits intermediaries while hurting both 
                farmers and consumers.
              </p>
            </div>
            <div className="problem-card">
              <h3>Lack of Transparency</h3>
              <p>
                Consumers rarely know where their food comes from or who grows it. This lack of 
                transparency makes it difficult to ensure quality and support local farmers.
              </p>
            </div>
          </div>

          <div className="impact-section">
            <h2>Our Impact</h2>
            <div className="impact-grid">
              <div className="impact-card">
                <FaHandshake className="impact-icon" />
                <h3>For Farmers</h3>
                <ul>
                  <li>Better prices without middlemen cuts</li>
                  <li>Direct connection with consumers</li>
                  <li>Fair compensation for their produce</li>
                  <li>Increased visibility and market access</li>
                  <li>Empowerment through technology</li>
                </ul>
              </div>
              <div className="impact-card">
                <FaChartLine className="impact-icon" />
                <h3>For Consumers</h3>
                <ul>
                  <li>Fresh produce directly from farms</li>
                  <li>Fair prices with transparency</li>
                  <li>Know your farmer, know your food</li>
                  <li>Support local agriculture</li>
                  <li>Quality assurance and traceability</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Join Us in This Journey</h2>
            <p>
              Whether you're a farmer looking to reach more customers or a consumer seeking 
              fresh, quality produce, KrishiConnect is here for you.
            </p>
            <div className="cta-buttons">
              <Link to="/register?role=farmer" className="btn btn-primary">
                Join as Farmer
              </Link>
              <Link to="/register?role=consumer" className="btn btn-secondary">
                Join as Consumer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

