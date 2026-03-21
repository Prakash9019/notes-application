import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaSignOutAlt, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem('jwtData');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwtData');
    setShowUserMenu(false);
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* 1. Left Section - Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                ✓
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* 2. Center Section - Desktop Navigation (Using !flex to override Bootstrap) */}
          <div className="hidden lg:!flex flex-1 justify-center items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-10 ${
                isActive('/')
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FaHome className="w-4 h-4" /> Home
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-10 ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                📊 Dashboard
              </Link>
            )}

            <Link
              to="/about"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-10 ${
                isActive('/about')
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FaInfoCircle className="w-4 h-4" /> About
            </Link>
          </div>

          {/* 3. Right Section - Auth & Theme */}
          <div className="hidden lg:!flex flex-1 justify-end items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-all duration-200 relative z-10 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun className="w-4 h-4 text-yellow-400" /> : <FaMoon className="w-4 h-4" />}
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div> {/* Divider */}

            {!isLoggedIn ? (
              <div className="flex items-center gap-3 relative z-10">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative z-50" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all focus:outline-none cursor-pointer"
                >
                  <FaUserCircle className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) - Forced hidden on desktop */}
          <div className="flex items-center gap-3 lg:!hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition-all"
            >
              {isDark ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="lg:!hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
            <Link to="/" className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Home</Link>
            {isLoggedIn && <Link to="/dashboard" className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/dashboard') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>Dashboard</Link>}
            <Link to="/about" className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive('/about') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>About</Link>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="flex justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Log in</Link>
                  <Link to="/signup" className="flex justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Sign up</Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"><FaSignOutAlt className="w-4 h-4" />Sign out</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;