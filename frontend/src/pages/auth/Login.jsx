import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If we came from checkout (or somewhere else), go back there after login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const result = await login(phoneNumber, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Failed to login. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <motion.div 
        className="auth-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1>Account</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Account</span>
        </div>
      </motion.div>

      {/* Login Form */}
      <div className="auth-container">
        <motion.div 
          className="auth-form-wrapper stitch-card"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="auth-form-header" variants={itemVariants}>
            <h2>Login</h2>
            <p>Please login using account details below.</p>
          </motion.div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <motion.div className="auth-error" variants={itemVariants}>{error}</motion.div>}
            
            <motion.div className="auth-input-group stitch-input" variants={itemVariants}>
              <input 
                type="tel" 
                id="phoneNumber"
                placeholder=" " 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
              <label htmlFor="phoneNumber">Phone Number</label>
            </motion.div>
            
            <motion.div className="auth-input-group stitch-input" variants={itemVariants}>
              <input 
                type="password" 
                id="password"
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </motion.div>

            <motion.div className="auth-actions" variants={itemVariants}>
              <button 
                type="submit" 
                className="auth-submit-btn stitch-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <Link to="/forgot-password" className="auth-forgot-link stitch-link">
                Forgot your password?
              </Link>
            </motion.div>
          </form>

          <motion.div variants={itemVariants}>
            <Link to="/register" className="auth-footer-link">
              Create account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
