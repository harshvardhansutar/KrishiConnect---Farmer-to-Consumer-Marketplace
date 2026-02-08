import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Auth.css';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'consumer';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: roleParam,
    // Farmer specific
    farmName: '',
    farmLocation: '',
    cropsGrown: '',
    // Address
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    if (formData.role === 'farmer') {
      userData.farmName = formData.farmName;
      userData.farmLocation = formData.farmLocation;
      if (formData.cropsGrown) {
        userData.cropsGrown = formData.cropsGrown.split(',').map(crop => crop.trim());
      }
    }

    const result = await register(userData);

    if (result.success) {
      navigate(formData.role === 'farmer' ? '/farmer/dashboard' : '/products');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Join KrishiConnect</h2>
          <p className="auth-subtitle">
            {formData.role === 'farmer' 
              ? 'Register as a farmer and start selling your produce'
              : 'Create an account to buy fresh produce'}
          </p>

          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${formData.role === 'farmer' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'farmer' })}
            >
              Farmer
            </button>
            <button
              type="button"
              className={`role-btn ${formData.role === 'consumer' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'consumer' })}
            >
              Consumer
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            {formData.role === 'farmer' && (
              <>
                <div className="form-group">
                  <label htmlFor="farmName">Farm Name</label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    placeholder="Enter your farm name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="farmLocation">Farm Location</label>
                  <input
                    type="text"
                    id="farmLocation"
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cropsGrown">Crops Grown (comma separated)</label>
                  <input
                    type="text"
                    id="cropsGrown"
                    name="cropsGrown"
                    value={formData.cropsGrown}
                    onChange={handleChange}
                    placeholder="e.g., Tomatoes, Wheat, Rice"
                  />
                </div>
              </>
            )}

            <h3 className="section-title">Address</h3>
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

