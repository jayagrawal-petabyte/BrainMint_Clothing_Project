import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing the same auth classes for consistency

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    const result = await register(firstName, lastName, email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <h1>Create account</h1>
        <div className="auth-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Create Account</span>
        </div>
      </div>

      {/* Register Form */}
      <div className="auth-container">
        <div className="auth-form-wrapper stitch-card">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Please register using account details below.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="auth-input-group stitch-input">
              <input 
                type="text" 
                id="firstName"
                placeholder=" " 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="firstName">First Name</label>
            </div>

            <div className="auth-input-group stitch-input">
              <input 
                type="text" 
                id="lastName"
                placeholder=" " 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
            
            <div className="auth-input-group stitch-input">
              <input 
                type="email" 
                id="email"
                placeholder=" " 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
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

            <div className="auth-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
