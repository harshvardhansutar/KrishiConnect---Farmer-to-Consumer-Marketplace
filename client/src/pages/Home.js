import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaUsers, FaRupeeSign, FaTruck, FaCheckCircle, FaStar } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const steps = [
    {
      icon: <FaUsers />,
      title: 'Register',
      description: 'Farmers register and list their produce. Consumers create an account to start shopping.'
    },
    {
      icon: <FaLeaf />,
      title: 'Browse & Order',
      description: 'Consumers browse fresh produce, view farmer details, and place orders directly.'
    },
    {
      icon: <FaTruck />,
      title: 'Get Fresh Produce',
      description: 'Receive fresh, farm-to-table produce with fair prices and direct farmer connection.'
    }
  ];

  const benefits = [
    {
      title: 'Fair Prices',
      description: 'Farmers get better prices without middlemen, consumers get fresh produce at fair rates.',
      icon: <FaRupeeSign />
    },
    {
      title: 'Fresh Produce',
      description: 'Direct from farm to your table, ensuring maximum freshness and quality.',
      icon: <FaLeaf />
    },
    {
      title: 'Transparency',
      description: 'Know exactly where your food comes from and who grows it.',
      icon: <FaCheckCircle />
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Farmer, Maharashtra',
      text: 'KrishiConnect has changed my life. I now get fair prices for my vegetables and connect directly with customers.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Consumer, Mumbai',
      text: 'The freshest vegetables I\'ve ever bought! Knowing the farmer makes it even better. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Farmer, Gujarat',
      text: 'No more middlemen taking huge cuts. I can now focus on growing quality produce and earning fair returns.',
      rating: 5
    }
  ];

  const featuredProducts = [
    { name: 'Fresh Tomatoes', category: 'Vegetables', price: '₹40/kg' },
    { name: 'Organic Wheat', category: 'Grains', price: '₹35/kg' },
    { name: 'Sweet Mangoes', category: 'Fruits', price: '₹80/kg' },
    { name: 'Fresh Milk', category: 'Dairy', price: '₹50/litre' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Empowering Farmers. Delivering Freshness.</h1>
            <p className="hero-subtitle">
              Connect directly with farmers and get fresh produce at fair prices. 
              No middlemen. Just farmers and you.
            </p>
            <div className="hero-buttons">
              <Link to="/register?role=farmer" className="btn btn-primary btn-large">
                Join us
              </Link>
              <Link to="/products" className="btn btn-secondary btn-large">
                Buy Fresh Produce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How KrishiConnect Works</h2>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits" id="benefits">
        <div className="container">
          <h2 className="section-title">Why Choose KrishiConnect?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-image">
                  <span className="product-emoji">
                    {product.category === 'Vegetables' && '🥬'}
                    {product.category === 'Fruits' && '🍎'}
                    {product.category === 'Grains' && '🌾'}
                    {product.category === 'Dairy' && '🥛'}
                  </span>
                </div>
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{product.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

