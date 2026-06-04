import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchMyOrders, fetchUserProfile, updateUserProfile, updateUserPassword } from '../../services/api';
import { Package, MapPin, User, LogOut, Edit2, Check, Clock, ChevronRight, ShoppingBag, Settings, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColorName } from '../../utils/helpers';
import './Account.css';

const Account = () => {
  const { user, isLoggedIn, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'address' or 'details'
  
  // Profile edit state
  const [profileForm, setProfileForm] = useState({ name: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India'
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      const loadData = async () => {
        setLoadingOrders(true);
        setLoadingProfile(true);
        
        try {
          const [ordersRes, profileRes] = await Promise.all([
            fetchMyOrders(token),
            fetchUserProfile(token)
          ]);
          
          if (ordersRes && ordersRes.success !== false) {
            setOrders(ordersRes.orders || ordersRes.data || []);
          }
          
          if (profileRes && profileRes.success !== false) {
            let p = profileRes.profile || profileRes.data?.user || profileRes.data || profileRes.user || user;
            // Handle if API returns { data: { user: {...} } } vs { data: {...} }
            if (p && p.user && !p.name) p = p.user;
            setProfile(p);
            setProfileForm({ name: p?.name || user?.name || '' });
            const defaultAddr = p?.addresses?.[0];
            if (defaultAddr) {
              setAddressForm({
                street: defaultAddr.address || defaultAddr.street || '',
                city: defaultAddr.city || '',
                state: defaultAddr.state || '',
                pincode: defaultAddr.pincode || '',
                country: defaultAddr.country || 'India'
              });
            }
          }
        } catch (e) {
          console.error("Failed to load account data", e);
        } finally {
          setLoadingOrders(false);
          setLoadingProfile(false);
        }
      };

      loadData();
    }
  }, [isLoggedIn, navigate, token, user]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    // Map 'street' to 'address' for backend schema
    const addressPayload = {
      fullName: profile?.name || user?.name || "Customer",
      phone: profile?.phoneNumber || user?.phoneNumber || user?.phone || "0000000000",
      ...addressForm,
      address: addressForm.street
    };
    delete addressPayload.street;

    const res = await updateUserProfile({ addresses: [addressPayload] }, token);
    if (res && res.success !== false) {
      setProfile(prev => ({ ...prev, addresses: [addressPayload] }));
      setIsEditingAddress(false);
    } else {
      alert("Failed to update address. Please try again.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    
    if (!profileForm.name.trim()) {
      return setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
    }
    
    const res = await updateUserProfile({ name: profileForm.name }, token);
    if (res && res.success !== false) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setProfile(prev => ({ ...prev, name: profileForm.name }));
      if (updateUser) updateUser({ name: profileForm.name });
    } else {
      setProfileMsg({ type: 'error', text: res?.message || 'Failed to update profile.' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    }
    
    const res = await updateUserPassword(passwordForm.currentPassword, passwordForm.newPassword, token);
    if (res && res.success !== false) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMsg({ type: 'error', text: res?.message || 'Failed to change password.' });
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="acc-badge acc-badge--pending">Pending</span>;
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') return <span className="acc-badge acc-badge--success">{status}</span>;
    if (s === 'processing' || s === 'pending') return <span className="acc-badge acc-badge--warning">{status}</span>;
    if (s === 'cancelled' || s === 'failed') return <span className="acc-badge acc-badge--danger">{status}</span>;
    return <span className="acc-badge acc-badge--default">{status}</span>;
  };

  const userName = profile?.name || user?.name || user?.email?.split('@')[0] || 'Guest User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="account-page">
      {/* Modern Header */}
      <div className="account-hero">
        <div className="container">
          <div className="account-hero-inner">
            <div className="account-avatar">
              {userInitials}
            </div>
            <div className="account-hero-text">
              <h1 className="font-montserrat">Welcome back, {userName.split(' ')[0]}!</h1>
              <p>{profile?.email || user?.email}</p>
            </div>
            <button onClick={handleLogout} className="account-logout-btn">
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container account-container">
        <div className="account-grid">
          
          {/* Sidebar Nav */}
          <div className="account-sidebar">
            <nav className="account-nav">
              <button 
                className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={18} />
                <span>Order History</span>
                <ChevronRight size={16} className="nav-arrow" />
              </button>
              <button 
                className={`account-nav-btn ${activeTab === 'address' ? 'active' : ''}`}
                onClick={() => setActiveTab('address')}
              >
                <MapPin size={18} />
                <span>Addresses</span>
                <ChevronRight size={16} className="nav-arrow" />
              </button>
              <button 
                className={`account-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <Settings size={18} />
                <span>Account Details</span>
                <ChevronRight size={16} className="nav-arrow" />
              </button>
              <button 
                className="account-nav-btn"
                onClick={() => navigate('/wishlist')}
              >
                <ShoppingBag size={18} />
                <span>Wishlist</span>
                <ChevronRight size={16} className="nav-arrow" />
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="account-content">
            <AnimatePresence mode="wait">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="account-panel"
                >
                  <div className="account-panel-header">
                    <h2 className="font-montserrat">Order History</h2>
                    <p>Track, return, or purchase items again</p>
                  </div>

                  {loadingOrders ? (
                    <div className="account-skeleton-list">
                      {[1, 2, 3].map(i => <div key={i} className="account-skeleton-item" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="account-empty-state">
                      <div className="account-empty-icon"><Package size={48} /></div>
                      <h3>No orders yet</h3>
                      <p>When you place an order, it will appear here.</p>
                      <Link to="/shop" className="account-empty-btn">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="account-orders-list">
                      {orders.map((order, idx) => (
                        <div key={order._id || order.id || idx} className="account-order-card">
                          <div className="order-card-header">
                            <div className="order-meta">
                              <span className="order-id">#{(order._id || order.id || '').substring(0, 8).toUpperCase()}</span>
                              <span className="order-date">
                                <Clock size={14} /> 
                                {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                            {getStatusBadge(order.status || order.orderStatus)}
                          </div>
                          <div className="order-card-body">
                            <div className="order-details-col">
                              <p className="order-label">Total Amount</p>
                              <p className="order-value font-montserrat">₹{order.totalPrice?.toLocaleString('en-IN') || 0}</p>
                            </div>
                            <div className="order-details-col">
                              <p className="order-label">Items</p>
                              <p className="order-value">{order.orderItems?.length || 1} item(s)</p>
                            </div>
                            <div className="order-actions">
                              <button 
                                className="order-action-btn"
                                onClick={() => setExpandedOrderId(expandedOrderId === (order._id || order.id) ? null : (order._id || order.id))}
                              >
                                {expandedOrderId === (order._id || order.id) ? 'Hide Details' : 'View Details'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Expanded Order Details */}
                          {expandedOrderId === (order._id || order.id) && (
                            <div className="order-expanded-details animate-in slide-in-from-top-2 duration-300">
                              <div className="expanded-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', borderTop: '1px solid var(--border-color-11)', backgroundColor: 'var(--section-bg-1)' }}>
                                <div className="expanded-items">
                                  <h4 style={{ fontSize: '14px', marginBottom: '15px', fontFamily: 'var(--ltn__heading-font)' }}>Items Ordered</h4>
                                  <div className="order-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(order.items || order.orderItems || []).map((item, i) => (
                                      <div key={i} className="order-item-row" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div className="order-item-img" style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--white-7)' }}>
                                          <img 
                                            src={item.product?.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image'} 
                                            alt={item.product?.name || 'Product'} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          />
                                        </div>
                                        <div className="order-item-info">
                                          <p style={{ margin: 0, fontWeight: 500, fontSize: '13px', color: 'var(--ltn__heading-color)' }}>{item.product?.name || 'Unknown Product'}</p>
                                          {(item.size || item.color) && (
                                            <p style={{ margin: '2px 0', fontSize: '12px', color: 'var(--ltn__paragraph-color)' }}>
                                              {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color && `Color: ${item.color.startsWith('#') ? getColorName(item.color) : item.color}`}
                                            </p>
                                          )}
                                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--ltn__paragraph-color)' }}>
                                            {item.quantity} × ₹{item.price?.toLocaleString('en-IN') || 0}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="expanded-shipping">
                                  <h4 style={{ fontSize: '14px', marginBottom: '15px', fontFamily: 'var(--ltn__heading-font)' }}>Shipping Address</h4>
                                  <div style={{ fontSize: '13px', color: 'var(--ltn__paragraph-color)', lineHeight: '1.6' }}>
                                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--ltn__heading-color)' }}>{order.shippingAddress?.fullName || order.user?.name}</p>
                                    <p style={{ margin: 0 }}>{order.shippingAddress?.address}</p>
                                    <p style={{ margin: 0 }}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                                    <p style={{ margin: 0, marginTop: '5px' }}>Phone: {order.shippingAddress?.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === 'address' && (
                <motion.div 
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="account-panel"
                >
                  <div className="account-panel-header">
                    <h2 className="font-montserrat">Saved Addresses</h2>
                    <p>Manage your shipping addresses for a faster checkout</p>
                  </div>

                  {loadingProfile ? (
                    <div className="account-skeleton-item" style={{ height: '150px' }} />
                  ) : isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="account-address-form">
                      <div className="form-group">
                        <label>Street Address</label>
                        <input type="text" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>PIN Code</label>
                          <input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Country</label>
                          <input type="text" readOnly value="India" className="bg-gray-50" />
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-save">
                          <Check size={16} /> Save Address
                        </button>
                        <button type="button" className="btn-cancel" onClick={() => setIsEditingAddress(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="account-address-card">
                      {profile?.addresses && profile.addresses.length > 0 ? (
                        <>
                          <div className="address-card-header">
                            <h3 className="font-montserrat">Default Address</h3>
                            <button onClick={() => setIsEditingAddress(true)} className="btn-edit-address">
                              <Edit2 size={14} /> Edit
                            </button>
                          </div>
                          <address className="address-content">
                            <p className="address-name">{userName}</p>
                            <p>{profile.addresses[0].street}</p>
                            <p>{profile.addresses[0].city}, {profile.addresses[0].state} {profile.addresses[0].pincode}</p>
                            <p>{profile.addresses[0].country}</p>
                            {profile?.phoneNumber && <p className="address-phone">Phone: {profile.phoneNumber}</p>}
                          </address>
                        </>
                      ) : (
                        <div className="account-empty-state">
                          <div className="account-empty-icon"><MapPin size={48} /></div>
                          <h3>No address saved</h3>
                          <p>Add a default shipping address for faster checkout.</p>
                          <button onClick={() => setIsEditingAddress(true)} className="account-empty-btn">
                            Add Address
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="account-panel"
                >
                  <div className="account-panel-header">
                    <h2 className="font-montserrat">Account Details</h2>
                    <p>Update your personal information and password</p>
                  </div>

                  <div className="account-details-grid">
                    {/* Personal Info */}
                    <div className="details-section">
                      <div className="details-section-header">
                        <User size={18} />
                        <h3>Personal Information</h3>
                      </div>
                      <form onSubmit={handleUpdateProfile} className="account-address-form mb-8">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input 
                            type="text" 
                            value={profileForm.name} 
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                            required 
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={profile?.email || user?.email || ''} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                            <span className="text-xs text-gray-400 mt-1 block">Email cannot be changed</span>
                          </div>
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={profile?.phoneNumber || user?.phoneNumber || ''} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                            <span className="text-xs text-gray-400 mt-1 block">Phone number cannot be changed</span>
                          </div>
                        </div>
                        <button type="submit" className="btn-save mt-2">
                          Save Changes
                        </button>
                        {profileMsg.text && (
                          <p className={`mt-3 text-sm font-medium ${profileMsg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {profileMsg.text}
                          </p>
                        )}
                      </form>
                    </div>

                    {/* Change Password */}
                    <div className="details-section">
                      <div className="details-section-header">
                        <Lock size={18} />
                        <h3>Change Password</h3>
                      </div>
                      <form onSubmit={handleUpdatePassword} className="account-address-form">
                        <div className="form-group">
                          <label>Current Password</label>
                          <input 
                            type="password" 
                            value={passwordForm.currentPassword} 
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>New Password</label>
                          <input 
                            type="password" 
                            value={passwordForm.newPassword} 
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirm New Password</label>
                          <input 
                            type="password" 
                            value={passwordForm.confirmPassword} 
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
                            required 
                          />
                        </div>
                        <button type="submit" className="btn-save mt-2">
                          Update Password
                        </button>
                        {passwordMsg.text && (
                          <p className={`mt-3 text-sm font-medium ${passwordMsg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {passwordMsg.text}
                          </p>
                        )}
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
