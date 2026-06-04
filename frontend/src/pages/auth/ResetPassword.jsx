import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPasswordUser } from '../../services/api';
import { ArrowLeft } from 'lucide-react';
import './Login.css'; // Reusing Login.css for consistent auth styling

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await resetPasswordUser(token, password);
    setIsLoading(false);
    
    if (result && result.success !== false) {
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result?.message || 'Failed to reset password. The link might be expired.');
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <h1>Reset Password</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Reset Password</span>
        </div>
      </div>

      {/* Reset Form */}
      <div className="auth-container relative">
        {/* Mobile Back Arrow */}
        <div className="absolute top-2 left-4 md:hidden z-10" style={{ paddingBottom: '10px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="auth-form-wrapper stitch-card">
          <div className="auth-form-header">
            <h2>Create New Password</h2>
            <p>Please enter your new password below.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {message && <div style={{ backgroundColor: '#e6ffe6', color: '#006600', padding: '12px 20px', borderRadius: '0.25rem', marginBottom: '10px' }}>{message}</div>}
            
            <div className="auth-input-group stitch-input">
              <input 
                type="password" 
                id="password"
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">New Password</label>
            </div>

            <div className="auth-input-group stitch-input">
              <input 
                type="password" 
                id="confirmPassword"
                placeholder=" " 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirm New Password</label>
            </div>

            <div className="auth-actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <button 
                type="submit" 
                className="auth-submit-btn stitch-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login" className="auth-footer-link" style={{ display: 'inline-block' }}>
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
