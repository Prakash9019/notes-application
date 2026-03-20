
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const validateForm = () => {
    if (!credentials.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (credentials.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
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
    if (credentials.password !== credentials.cpassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            username: credentials.username,
            email: credentials.email,
            password: credentials.password
          })
        }
      );

      const json = await response.json();

      if (json.success) { // This will now be true on success
      localStorage.setItem('jwtData', json.jwtData);
      toast.success("✓ Account Created Successfully!");
      console.log('Token saved:', json.jwtData);
      setTimeout(() => navigate("/"), 1000);
    } else {
      // 2. This will now correctly display errors from the backend
      toast.error(json.errors?.[0]?.msg || "Registration failed");
    }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Registration failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    toast.info(`${provider} signup coming soon!`);
  };

  const passwordStrength = (() => {
    const pwd = credentials.password;
    if (!pwd) return { level: 0, text: "Enter password" };
    if (pwd.length < 6) return { level: 1, text: "Weak", color: "#FF6B6B" };
    if (pwd.length < 8) return { level: 2, text: "Fair", color: "#FFA500" };
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { level: 3, text: "Strong", color: "#51CF66" };
    }
    return { level: 2, text: "Fair", color: "#FFA500" };
  })();

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join TaskFlow and boost your productivity</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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
              {credentials.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.level / 3) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="cpassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showCPassword ? "text" : "password"}
                  id="cpassword"
                  name="cpassword"
                  value={credentials.cpassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="form-input"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCPassword(!showCPassword)}
                  disabled={loading}
                >
                  {showCPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {credentials.cpassword && credentials.password === credentials.cpassword && (
                <div className="password-match">
                  <FaCheckCircle /> Passwords match
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="terms-agreement">
              <input
                type="checkbox"
                id="terms"
                className="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <Link to="/terms" className="link-inline">Terms & Conditions</Link> and 
                <Link to="/privacy" className="link-inline">Privacy Policy</Link>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Or sign up with</span>
          </div>

          {/* Social Buttons */}
          <div className="social-buttons">
            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialSignup("Google")}
              disabled={loading}
            >
              <FaGoogle /> Google
            </button>
            <button
              type="button"
              className="social-button"
              onClick={() => handleSocialSignup("GitHub")}
              disabled={loading}
            >
              <FaGithub /> GitHub
            </button>
          </div>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account? <Link to="/login" className="link">Sign in</Link>
          </p>
        </div>

        {/* Right Section - Features */}
        <div className="auth-features">
          <div className="features-header">
            <h2>Get Started</h2>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">📋</div>
              <h3>Create Tasks</h3>
              <p>Organize work with priority levels</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get intelligent suggestions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor productivity metrics</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Stay Organized</h3>
              <p>Keep everything in one place</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
