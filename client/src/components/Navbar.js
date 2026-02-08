import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-icon">🌾</span>
            <span className="logo-text">KrishiConnect</span>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>

            {user ? (
              <>
                {user.role === 'farmer' && (
                  <li>
                    <Link to="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'consumer' && (
                  <>
                    <li>
                      <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                        <FaShoppingCart /> Cart
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                        Orders
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="user-menu">
                  <span className="user-name">
                    <FaUser /> {user.name}
                  </span>
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

