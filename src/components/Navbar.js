import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = !!localStorage.getItem('jwtData');

  const handleLogout = () => {
    localStorage.removeItem('jwtData');
    setShowUserMenu(false);
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📝 TaskFlow
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FaHome /> Home
            </Link>
          </li>

          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                  📊 Dashboard
                </Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FaInfoCircle /> About
            </Link>
          </li>
        </ul>

        <div className="nav-auth">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-btn login-btn" onClick={() => setIsOpen(false)}>
                <FaSignInAlt /> Login
              </Link>
              <Link to="/signup" className="nav-btn signup-btn" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
 
              )}
            </div>
          </div>
    </nav>
  );
};

export default Navbar;
