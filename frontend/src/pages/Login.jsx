import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
        <div className="auth-form-wrapper stitch-card">
          <div className="auth-form-header">
            <h2>Login</h2>
            <p>Please login using account details below.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="auth-input-group stitch-input">
              <input 
                type="tel" 
                id="phoneNumber"
                placeholder=" " 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
              <label htmlFor="phoneNumber">Phone Number</label>
            </div>
            
            <div className="auth-input-group stitch-input">
              <input 
                type="password" 
                id="password"
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="auth-actions">
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
