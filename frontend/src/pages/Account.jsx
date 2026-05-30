import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null; // Prevent flicker before redirect

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <h1>Account</h1>
        <div className="account-breadcrumb">
          <Link to="/">Home</Link>
          <span>&gt;</span>
          <span>Account</span>
        </div>
      </div>

      <div className="account-container">
        <div className="account-top-bar">
          <h2>My Account</h2>
          <button onClick={handleLogout} className="account-logout-link">
            Logout
          </button>
        </div>

        <div className="account-content-grid">
          {/* Left Col: Order History */}
          <div className="account-section">
            <h3>Order History</h3>
            <p>You haven't placed any orders yet.</p>
          </div>

          {/* Right Col: Account Details */}
          <div className="account-section">
            <h3>Account Details</h3>
            <p className="account-user-name">
              {user?.name || user?.email?.split('@')[0] || 'Guest User'}
            </p>
            
            <p>India</p>

            <Link to="#" className="account-address-link">
              View Addresses (1)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
