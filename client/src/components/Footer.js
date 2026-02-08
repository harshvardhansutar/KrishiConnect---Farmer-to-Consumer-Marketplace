import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>KrishiConnect</h3>
            <p>Connecting farmers directly with consumers for fresh produce and fair prices.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Farmers</h4>
            <ul>
              <li><Link to="/register">Join as Farmer</Link></li>
              <li><Link to="/farmer/dashboard">Farmer Dashboard</Link></li>
              <li><a href="#benefits">Benefits</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul>
              <li><FaEnvelope /> info@krishiconnect.com</li>
              <li><FaPhone /> +91 1800-XXX-XXXX</li>
              <li>Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 KrishiConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

