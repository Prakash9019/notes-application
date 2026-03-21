import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaArrowRight, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const Signup = () => {
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "", cpassword: "" });
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
    if (!credentials.username.trim() || credentials.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      toast.error("Please enter a valid email");
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
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password
        })
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem('jwtData', json.jwtData);
        toast.success("Account Created Successfully!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(json.errors?.[0]?.msg || "Registration failed");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const pwd = credentials.password;
    if (!pwd) return { level: 0, text: "Enter password" };
    if (pwd.length < 6) return { level: 1, text: "Weak", color: "#EF4444" };
    if (pwd.length < 8) return { level: 2, text: "Fair", color: "#F59E0B" };
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { level: 3, text: "Strong", color: "#10B981" };
    }
    return { level: 2, text: "Fair", color: "#F59E0B" };
  })();

  const passwordsMatch = credentials.password && credentials.cpassword && credentials.password === credentials.cpassword;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[30rem] h-[30rem] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl absolute -top-20 -left-20 animate-pulse"></div>
        <div className="w-[30rem] h-[30rem] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl absolute -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <span className="text-2xl text-white font-bold">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join TaskFlow and boost your productivity
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Bar */}
              {credentials.password && (
                <div className="pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Strength</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: passwordStrength.color }}>{passwordStrength.text}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-300" style={{ width: `${(passwordStrength.level / 3) * 100}%`, backgroundColor: passwordStrength.color }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 pb-2">
              <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showCPassword ? "text" : "password"}
                  id="cpassword"
                  name="cpassword"
                  value={credentials.cpassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 text-sm bg-gray-50 dark:bg-gray-800/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${credentials.cpassword && !passwordsMatch ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
                  required
                />
                <button type="button" onClick={() => setShowCPassword(!showCPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showCPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {/* Match Indicator */}
              {credentials.cpassword && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {passwordsMatch ? <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <FaTimesCircle className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-xs font-medium ${passwordsMatch ? 'text-emerald-500' : 'text-red-500'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-700 cursor-pointer transition-colors"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer leading-tight">
                I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <>Create Account <FaArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Bottom Links Section */}
          <div className="px-8 pb-8 pt-2 bg-white/50 dark:bg-gray-900/50">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"></div></div>
              <span className="relative px-4 text-xs font-medium text-gray-500 bg-white dark:bg-gray-900">Already have an account?</span>
            </div>
            <Link
              to="/login"
              className="w-full flex items-center justify-center py-3 px-4 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              Sign In to TaskFlow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;