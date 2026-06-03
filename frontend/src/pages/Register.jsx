import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing the same auth classes for consistency

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setError('Please fill out all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const result = await register(firstName, lastName, email, phoneNumber, password);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
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
        <h1>Create account</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Create Account</span>
        </div>
      </motion.div>

      {/* Register Form */}
      <div className="auth-container">
        <motion.div 
          className="auth-form-wrapper stitch-card"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="auth-form-header" variants={itemVariants}>
            <h2>Create Account</h2>
            <p>Please register using account details below.</p>
          </motion.div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <motion.div className="auth-error" variants={itemVariants}>{error}</motion.div>}
            
            <motion.div className="auth-input-group stitch-input" variants={itemVariants}>
              <input 
                type="text" 
                id="firstName"
                placeholder=" " 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="firstName">First Name</label>
            </motion.div>

            <motion.div className="auth-input-group stitch-input" variants={itemVariants}>
              <input 
                type="text" 
                id="lastName"
                placeholder=" " 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </motion.div>
            
            <motion.div className="auth-input-group stitch-input" variants={itemVariants}>
              <input 
                type="email" 
                id="email"
                placeholder=" " 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email Address</label>
            </motion.div>
            
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

            <motion.div className="auth-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }} variants={itemVariants}>
              <button 
                type="submit" 
                className="auth-submit-btn stitch-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
              
              <Link to="/" className="auth-footer-link" style={{ marginTop: '0' }}>
                Return to Store
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
