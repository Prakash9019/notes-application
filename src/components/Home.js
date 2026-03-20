
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaCheck,
//   FaFilter,
//   FaChartBar,
//   FaBrain,
//   FaLock,
//   FaBolt,
//   FaArrowRight,
//   FaGoogle,
//   FaGithub,
// } from "react-icons/fa";
// import "./Home.css";

// const Home = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("jwtData"));
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const features = [
//     {
//       icon: <FaCheck className="feature-icon" />,
//       title: "Task Management",
//       description:
//         "Organize tasks with priority levels, status tracking, and smart categorization",
//       color: "#FF6B6B",
//     },
//     {
//       icon: <FaFilter className="feature-icon" />,
//       title: "Advanced Filtering",
//       description:
//         "Filter tasks by priority, status, date range, and custom tags for efficient management",
//       color: "#4ECDC4",
//     },
//     {
//       icon: <FaBrain className="feature-icon" />,
//       title: "AI Smart Notes",
//       description:
//         "AI-powered note summarization, tagging, and intelligent recommendations",
//       color: "#95E1D3",
//     },
//     {
//       icon: <FaChartBar className="feature-icon" />,
//       title: "Analytics",
//       description:
//         "Visual insights into productivity with charts and completion statistics",
//       color: "#F38181",
//     },
//     {
//       icon: <FaLock className="feature-icon" />,
//       title: "Secure & Private",
//       description: "End-to-end encryption with JWT authentication for your data",
//       color: "#AA96DA",
//     },
//     {
//       icon: <FaBolt className="feature-icon" />,
//       title: "Real-time Sync",
//       description: "Instant synchronization across all your devices",
//       color: "#FCBAD3",
//     },
//   ];

//   const stats = [
//     { number: "10K+", label: "Active Users" },
//     { number: "1M+", label: "Tasks Created" },
//     { number: "99.9%", label: "Uptime" },
//   ];

//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero-section" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
//         <div className="hero-content">
//           <div className="hero-badge">✨ Productivity Redefined</div>
//           <h1 className="hero-title">
//             Your Smart <span className="gradient-text">Task Companion</span>
//           </h1>
//           <p className="hero-subtitle">
//             Stay organized with intelligent task management, AI-powered insights,
//             and seamless collaboration. Transform the way you work.
//           </p>

//           <div className="hero-buttons">
//             {!isLoggedIn ? (
//               <>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigate("/signup")}
//                 >
//                   Get Started Free <FaArrowRight />
//                 </button>
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => navigate("/login")}
//                 >
//                   Sign In
//                 </button>
//               </>
//             ) : (
//               <button
//                 className="btn btn-primary"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Go to Dashboard <FaArrowRight />
//               </button>
//             )}
//           </div>

//           <div className="social-buttons">
//             <button className="social-btn">
//               <FaGoogle /> Continue with Google
//             </button>
//             <button className="social-btn">
//               <FaGithub /> Continue with GitHub
//             </button>
//           </div>
//         </div>

//         <div className="hero-visual">
//           <div className="floating-card card-1">
//             <div className="card-header">📋 Project Alpha</div>
//             <div className="card-task">✓ Design UI Components</div>
//             <div className="card-priority high">High Priority</div>
//           </div>
//           <div className="floating-card card-2">
//             <div className="card-header">🎯 Tasks Today</div>
//             <div className="card-count">8 of 12</div>
//             <div className="progress-bar">
//               <div className="progress-fill" style={{ width: "67%" }}></div>
//             </div>
//           </div>
//           <div className="floating-card card-3">
//             <div className="card-header">🤖 AI Suggestions</div>
//             <div className="card-text">Optimize your workflow</div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="features-section">
//         <div className="section-header">
//           <h2>Powerful Features</h2>
//           <p>Everything you need to stay productive</p>
//         </div>

//         <div className="features-grid">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="feature-card"
//               style={{ "--accent-color": feature.color }}
//             >
//               <div className="feature-icon-wrapper">{feature.icon}</div>
//               <h3>{feature.title}</h3>
//               <p>{feature.description}</p>
//               <div className="feature-hover">Learn more →</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="stats-section">
//         <div className="stats-container">
//           {stats.map((stat, index) => (
//             <div key={index} className="stat-card">
//               <div className="stat-number">{stat.number}</div>
//               <div className="stat-label">{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* AI Features Section */}
//       <section className="ai-features-section">
//         <div className="ai-content">
//           <div className="ai-text">
//             <h2>Powered by Artificial Intelligence</h2>
//             <p>
//               Our advanced AI engine learns your workflow patterns and provides
//               intelligent recommendations to boost your productivity.
//             </p>
//             <ul className="ai-benefits">
//               <li>🤖 Auto-tag and categorize tasks</li>
//               <li>📊 Smart priority suggestions</li>
//               <li>⏱️ Intelligent time estimation</li>
//               <li>💡 Productivity insights</li>
//             </ul>
//             <button className="btn btn-outline">Explore AI Features</button>
//           </div>
//           <div className="ai-visual">
//             <div className="ai-brain">
//               <div className="brain-wave"></div>
//               <div className="brain-wave"></div>
//               <div className="brain-wave"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta-section">
//         <h2>Ready to Transform Your Productivity?</h2>
//         <p>Join thousands of users who have already improved their workflow</p>
//         {!isLoggedIn ? (
//           <button
//             className="btn btn-large"
//             onClick={() => navigate("/signup")}
//           >
//             Start Your Free Trial
//           </button>
//         ) : (
//           <button
//             className="btn btn-large"
//             onClick={() => navigate("/dashboard")}
//           >
//             Open Dashboard
//           </button>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtData');
    console.log("JWT Token:", token);
    setIsLoggedIn(!!token);
  }, []);

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Your Life with <span className="gradient-text">TaskFlow</span>
          </h1>
          <p className="hero-subtitle">
            The smart task management app powered by AI. Stay organized, boost productivity, 
            and never miss a deadline again.
          </p>
          
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>
              Get Started Free
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Tasks Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h4>Design Homepage</h4>
              <span className="badge badge-high">High Priority</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🚀</div>
            <div className="card-content">
              <h4>Launch Product</h4>
              <span className="badge badge-progress">In Progress</span>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h4>80% Complete</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">Powerful features to keep you organized</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Task Management</h3>
            <p>Create, organize, and track tasks with priority levels and status updates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>Get intelligent suggestions for priorities, tags, and task organization</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Kanban Board</h3>
            <p>Visualize your workflow with drag-and-drop task management</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Find tasks instantly with powerful filtering and search capabilities</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Analytics</h3>
            <p>Track productivity with detailed insights and completion statistics</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and protected with enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds - it's completely free</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add Tasks</h3>
            <p>Create tasks with priorities and deadlines</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Stay Organized</h3>
            <p>Manage everything in one beautiful dashboard</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Organized?</h2>
        <p>Join thousands of users who are already boosting their productivity</p>
        <div className="cta-buttons">
          <button className="btn btn-large btn-primary" onClick={() => navigate("/signup")}>
            Start Free Today
          </button>
          <button className="btn btn-large btn-secondary" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;