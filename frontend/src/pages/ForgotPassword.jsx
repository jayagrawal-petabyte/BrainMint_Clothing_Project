import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordUser } from '../services/api';
import './Login.css'; // Reusing Login.css for consistent auth styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const result = await forgotPasswordUser(email);
    setIsLoading(false);
    
    if (result && result.success !== false) {
      setMessage('If an account matches that phone number, a reset link will be sent.');
    } else {
      setError(result?.error || 'Failed to request password reset.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Reset Password</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Reset Password</span>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-form-wrapper stitch-card">
          <div className="auth-form-header">
            <h2>Forgot Password</h2>
            <p>Enter your email address and we will send you a reset link.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {message && <div style={{ backgroundColor: '#e6ffe6', color: '#006600', padding: '12px 20px', borderRadius: '0.25rem', marginBottom: '10px' }}>{message}</div>}
            
            <div className="auth-input-group stitch-input">
              <input 
                type="email" 
                id="email"
                placeholder=" " 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="auth-actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <button 
                type="submit" 
                className="auth-submit-btn stitch-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Requesting...' : 'Reset Password'}
              </button>
              <Link to="/login" className="auth-forgot-link stitch-link" style={{ textAlign: 'center', marginTop: '15px' }}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
