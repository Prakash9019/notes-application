# Firebase Google Sign-in Implementation

## Step 1: Install Firebase Dependencies

```bash
npm install firebase react-firebase-hooks
```

## Step 2: Create firebaseConfig.js

```javascript
// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Get these values from Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

## Step 3: Updated Login.js with Google Sign-in

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
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
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(credentials.email)) {
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

  // Traditional Email/Password Login
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
        setTimeout(() => navigate("/dashboard"), 1000);
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

  // Google Sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send token to your backend for verification and JWT generation
      const response = await axios.post(
        'http://localhost:5000/api/auth/google-login',
        {
          idToken: idToken,
          email: user.email,
          username: user.displayName,
          photoURL: user.photoURL
        }
      );

      const json = response.data;
      if (json.sucess || json.success) {
        localStorage.setItem('jwtData', json.jwtData);
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        }));
        console.log('Google Login Token saved:', json.jwtData);
        toast.success("✓ Google Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(json.errors?.[0]?.msg || "Google login failed");
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Login popup was closed");
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error("Login request was cancelled");
      } else {
        toast.error(error.message || "Google login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in to your TaskFlow account</h1>
          <p>Organize with priority and status tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="icon" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="icon" />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
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

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FaGoogle className="google-icon" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Sign up link */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

## Step 4: Updated Signup.js with Google Sign-up

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
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
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(credentials.email)) {
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

  // Traditional Email/Password Sign-up
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
      if (json.success) {
        localStorage.setItem('jwtData', json.jwtData);
        toast.success("✓ Account Created Successfully!");
        console.log('Token saved:', json.jwtData);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(json.errors?.[0]?.msg || "Registration failed");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Registration failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send token to your backend for verification and JWT generation
      const response = await fetch(
        "http://localhost:5000/api/auth/google-signup",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken,
            email: user.email,
            username: user.displayName,
            photoURL: user.photoURL
          })
        }
      );

      const json = await response.json();
      if (json.success || json.sucess) {
        localStorage.setItem('jwtData', json.jwtData);
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        }));
        toast.success("✓ Account Created Successfully!");
        console.log('Google Signup Token saved:', json.jwtData);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(json.errors?.[0]?.msg || "Google signup failed");
      }
    } catch (error) {
      console.error('Google signup error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Signup popup was closed");
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error("Signup request was cancelled");
      } else {
        toast.error(error.message || "Google signup failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
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
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join TaskFlow and boost your productivity</h1>
          <p>Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="icon" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={credentials.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="icon" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="icon" />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
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
                <div
                  className="strength-bar"
                  style={{
                    width: `${(passwordStrength.level / 3) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                />
                <span style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cpassword">
              <FaLock className="icon" />
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showCPassword ? "text" : "password"}
                id="cpassword"
                name="cpassword"
                placeholder="Confirm your password"
                value={credentials.cpassword}
                onChange={handleChange}
                disabled={loading}
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
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        {/* Google Sign-up Button */}
        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <FaGoogle className="google-icon" />
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>

        {/* Sign in link */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
```

## Step 5: Backend Endpoint - google-login (Add to your backend)

```javascript
// routes/auth.js (Backend)
const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('../path-to-serviceAccountKey.json'))
});

// Google Login Endpoint
router.post('/google-login', async (req, res) => {
  try {
    const { idToken, email, username } = req.body;

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        username: username || email.split('@')[0],
        email,
        googleId: decodedToken.uid,
        isGoogleAuth: true
      });
      await user.save();
    }

    // Generate JWT token
    const jwtData = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ sucess: true, jwtData });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ errors: [{ msg: 'Google login failed' }] });
  }
});
```

## Step 6: CSS for Google Button

Add to your Auth.css:

```css
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  width: 100%;
  padding: var(--space-16);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.btn-google:hover {
  background: var(--color-secondary);
  border-color: #4285F4;
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  color: #4285F4;
  font-size: var(--font-size-lg);
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  margin: var(--space-24) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
```

## Step 7: Update App.js to include routes

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import NoteState from "./NoteState";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  return (
    <Router>
      <NoteState>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </NoteState>
    </Router>
  );
}

export default App;
```

## Important Notes:

1. **Get Firebase Credentials**: Go to Firebase Console → Project Settings → Service Account → Download private key for backend
2. **Environment Variables**: Add your Firebase config to `.env` file
3. **Backend Setup**: Install `firebase-admin` package on backend: `npm install firebase-admin`
4. **CORS**: Make sure your backend allows requests from your frontend domain
5. **Redirect URI**: In Firebase Console, add your app URL to authorized redirect URIs