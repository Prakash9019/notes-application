
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const validateForm = () => {
    if (!credentials.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!credentials.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const json = response.data;

      if (json.sucess) {
        localStorage.setItem('jwtData', json.jwtData);
        console.log('Token saved:', json.jwtData);
        toast.success("✓ Login Successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(json.errors?.[0]?.msg || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 400) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(error.message || "Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your TaskFlow account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot?
                </Link>
              </div>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                className="checkbox"
                disabled={loading}
              />
              <label htmlFor="remember" className="checkbox-label">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Or continue with</span>
          </div>

          {/* Social Buttons */}
          <div className="social-buttons">
            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialLogin("Google")}
              disabled={loading}
            >
              <FaGoogle /> Google
            </button>
            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialLogin("GitHub")}
              disabled={loading}
            >
              <FaGithub /> GitHub
            </button>
          </div>

          {/* Signup Link */}
          <p className="auth-footer">
            Don't have an account? <Link to="/signup" className="link">Sign up</Link>
          </p>
        </div>

        {/* Right Section - Features */}
        <div className="auth-features">
          <div className="features-header">
            <h2>Why TaskFlow?</h2>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <h3>Smart Task Management</h3>
              <p>Organize with priority and status tracking</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>Intelligent suggestions and recommendations</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track productivity with insights</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your data is protected with encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
