import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
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

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <h1>Account</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Account</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>Login</h2>
            <p>Please login using account detail bellow.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="auth-input-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-actions">
              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot your password?
              </Link>
            </div>
          </form>

          <Link to="/register" className="auth-footer-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
