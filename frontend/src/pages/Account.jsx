import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders, fetchUserProfile, updateUserProfile } from '../services/api';
import './Account.css';

const Account = () => {
  const { user, isLoggedIn, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India'
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // Load Orders
      const loadOrders = async () => {
        setLoadingOrders(true);
        const res = await fetchMyOrders(token);
        if (res && res.success !== false) {
          setOrders(res.orders || res.data || []);
        }
        setLoadingOrders(false);
      };
      
      // Load Profile
      const loadProfile = async () => {
        setLoadingProfile(true);
        const res = await fetchUserProfile(token);
        if (res && res.success !== false) {
          setProfile(res.profile || res.data || res.user || user);
          
          const defaultAddr = res.profile?.addresses?.[0] || res.data?.addresses?.[0] || res.user?.addresses?.[0];
          if (defaultAddr) {
            setAddressForm({
              street: defaultAddr.street || '',
              city: defaultAddr.city || '',
              state: defaultAddr.state || '',
              pincode: defaultAddr.pincode || '',
              country: defaultAddr.country || 'India'
            });
          }
        }
        setLoadingProfile(false);
      };

      loadOrders();
      loadProfile();
    }
  }, [isLoggedIn, navigate, token, user]);

  if (!isLoggedIn) return null; // Prevent flicker before redirect

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAddress = async () => {
    if (!token) return;
    const res = await updateUserProfile({ addresses: [addressForm] }, token);
    if (res && res.success !== false) {
      setProfile(prev => ({ ...prev, addresses: [addressForm] }));
      setIsEditingAddress(false);
    } else {
      alert("Failed to update address");
    }
  };

  const getOrderStatusColor = (status) => {
    if (!status) return '#666';
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') return '#008000';
    if (s === 'processing' || s === 'pending') return '#ff9900';
    if (s === 'cancelled' || s === 'failed') return '#cc0000';
    return '#666';
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
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="orders-table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '10px 0' }}>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id || order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '15px 0' }}>{(order._id || order.id).substring(0, 8).toUpperCase()}</td>
                        <td>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>₹{order.totalPrice?.toLocaleString('en-IN') || 0}</td>
                        <td style={{ color: getOrderStatusColor(order.status), fontWeight: '500', textTransform: 'capitalize' }}>
                          {order.status || 'Pending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Col: Account Details */}
          <div className="account-section">
            <h3>Account Details</h3>
            <p className="account-user-name">
              {profile?.name || user?.name || user?.email?.split('@')[0] || 'Guest User'}
            </p>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              {profile?.phoneNumber || user?.phoneNumber || user?.email || ''}
            </p>

            <h4 style={{ margin: '20px 0 10px', fontSize: '16px' }}>Default Address</h4>
            
            {loadingProfile ? (
              <p>Loading profile...</p>
            ) : isEditingAddress ? (
              <div className="address-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd' }} />
                <input type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', width: '50%' }} />
                  <input type="text" placeholder="PIN Code" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', width: '50%' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={handleSaveAddress} style={{ background: '#000', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setIsEditingAddress(false)} style={{ background: '#eee', color: '#333', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="saved-address">
                {profile?.addresses && profile.addresses.length > 0 ? (
                  <>
                    <p style={{ margin: '5px 0' }}>{profile.addresses[0].street}</p>
                    <p style={{ margin: '5px 0' }}>{profile.addresses[0].city}, {profile.addresses[0].state} {profile.addresses[0].pincode}</p>
                    <p style={{ margin: '5px 0' }}>{profile.addresses[0].country}</p>
                  </>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#888' }}>No address saved.</p>
                )}
                
                <button 
                  onClick={() => setIsEditingAddress(true)} 
                  className="account-address-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', marginTop: '10px', cursor: 'pointer' }}
                >
                  {profile?.addresses && profile.addresses.length > 0 ? 'Edit Address' : 'Add Address'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
