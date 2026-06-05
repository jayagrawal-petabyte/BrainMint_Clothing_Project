import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Truck, RotateCcw, Tag, ChevronDown, ChevronUp, ChevronRight, Check, ShoppingBag, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder, fetchUserProfile, validateCoupon } from '../../services/api';
import './Checkout.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const STEPS = ['Contact', 'Delivery', 'Payment'];

/* ── Floating label input — no placeholder collision ── */
const FloatField = ({ id, name, label, type = 'text', value, onChange, optional, error }) => (
  <div className="ff-container">
    <div className={`ff ${value ? 'ff--has' : ''} ${error ? 'ff--error' : ''}`}>
      <input
        id={id} name={name} type={type}
        value={value} onChange={onChange}
        className="ff__input"
        placeholder=" "
      />
      <label htmlFor={id} className="ff__label">
        {label}{optional ? <em> (optional)</em> : ''}
      </label>
      <span className="ff__bar" />
    </div>
    {error && <span className="ff__err-msg">{error}</span>}
  </div>
);

/* ── Floating label select ── */
const FloatSelect = ({ id, name, label, value, onChange, children }) => (
  <div className="ff ff--has">
    <select id={id} name={name} value={value} onChange={onChange} className="ff__input ff__select">
      {children}
    </select>
    <label htmlFor={id} className="ff__label ff__label--up">{label}</label>
    <ChevronDown size={15} className="ff__arrow" />
    <span className="ff__bar" />
  </div>
);

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [fetchedProfile, setFetchedProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);

  const [form, setForm] = useState({
    email: '', phone: '', newsletter: false,
    firstName: '', lastName: '',
    address: '', apartment: '',
    city: '', state: 'Odisha', pincode: '',
    saveInfo: false,
  });

  useEffect(() => {
    if (token) {
      fetchUserProfile(token)
        .then(res => {
          if (res && res.success !== false) {
            setFetchedProfile(res.profile || res.data || res.user);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    const profileSource = fetchedProfile || user;
    if (!profileSource) return;

    setForm(prev => {
      const isEmailEmpty = !prev.email;
      const isPhoneEmpty = !prev.phone;
      const isFirstNameEmpty = !prev.firstName;
      const isLastNameEmpty = !prev.lastName;
      const isAddressEmpty = !prev.address;
      const isCityEmpty = !prev.city;
      const isPincodeEmpty = !prev.pincode;

      let first = '';
      let last = '';
      const name = profileSource.name || user?.name || '';
      if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length > 0) {
          first = parts[0];
          last = parts.slice(1).join(' ');
        }
      }
      
      const defaultAddr = profileSource.addresses?.[0] || user?.addresses?.[0];

      return {
        ...prev,
        email: isEmailEmpty ? (profileSource.email || user?.email || '') : prev.email,
        phone: isPhoneEmpty ? (profileSource.phoneNumber || profileSource.phone || user?.phoneNumber || user?.phone || '') : prev.phone,
        firstName: isFirstNameEmpty ? (first || '') : prev.firstName,
        lastName: isLastNameEmpty ? (last || '') : prev.lastName,
        address: isAddressEmpty ? (defaultAddr?.address || defaultAddr?.street || profileSource.address || user?.address || '') : prev.address,
        city: isCityEmpty ? (defaultAddr?.city || profileSource.city || user?.city || '') : prev.city,
        state: prev.state === 'Odisha' ? (defaultAddr?.state || profileSource.state || user?.state || 'Odisha') : prev.state,
        pincode: isPincodeEmpty ? (defaultAddr?.pincode || profileSource.pincode || user?.pincode || '') : prev.pincode,
      };
    });
  }, [user, fetchedProfile]);

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login but save the current location so they come back after login
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const isEmailValid = (email) => {
    if (!email) return false;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhone = /^[6-9]\d{9}$/.test(email.replace(/[\s-]/g, ''));
    return isEmail || isPhone;
  };

  const handleContinueToDelivery = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Please enter an email or phone number.";
    } else if (!isEmailValid(form.email)) {
      newErrors.email = "Please enter a valid email address or 10-digit mobile number.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setActiveStep(1);
    }
  };

  const handleContinueToPayment = () => {
    const newErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.pincode.trim()) {
      newErrors.pincode = "PIN code is required.";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      if (!form.phone) {
        setForm(prev => ({ ...prev, phone: prev.email }));
      }
      setActiveStep(2);
    }
  };

  const getImage = (item) => item?.images?.[0]?.url || item?.images?.[0] || 'https://placehold.co/64x80?text=Item';
  const getPrice = (item) => item?.discountPrice || item?.price || 0;
  const getId   = (item) => item?._id || item?.id;

  const shipping    = cartTotal > 999 ? 0 : 99;
  const discount    = couponApplied ? Math.round(cartTotal * (discountPercent / 100)) : 0;
  const finalTotal  = cartTotal + shipping - discount;

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError(false);
    
    try {
      const res = await validateCoupon(coupon.trim());
      if (res && res.success !== false && (res.valid || res.discount || res.data)) {
        setCouponApplied(true);
        const backendDiscount = res.data?.coupon?.discountValue || res.discount || res.data?.discount || res.data?.discountPercentage || res.discountPercentage;
        setDiscountPercent(backendDiscount || 10);
      } else {
        setCouponError(true);
      }
    } catch (error) {
      setCouponError(true);
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setOrderStatus(null);

    // Format order payload
    const orderData = {
      orderItems: cartItems.map(item => ({
        product: getId(item),
        name: item.name,
        quantity: item.quantity,
        price: getPrice(item),
        image: getImage(item)
      })),
      shippingAddress: {
        name: `${form.firstName} ${form.lastName}`.trim() || user?.name || 'Customer',
        fullName: `${form.firstName} ${form.lastName}`.trim() || user?.name || 'Customer',
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        country: "India"
      },
      paymentMethod: paymentMethod,
      taxPrice: 0,
      shippingPrice: shipping,
      totalPrice: finalTotal
    };

    const response = await placeOrder(orderData, token);

    setIsSubmitting(false);

    if (response && response.success !== false) {
      // Save order details to local storage so it shows up in the admin panel
      const newOrder = {
        id: response.data?.orderId || response.order?._id || response.data?._id || `#UW-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: `${form.firstName} ${form.lastName}`.trim() || user?.name || 'Customer',
        email: form.email || user?.email || '',
        product: cartItems.map(item => `${item.name} (x${item.quantity})`).join(', '),
        amount: `₹${finalTotal.toLocaleString('en-IN')}`,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentMethod: paymentMethod,
        items: cartItems
      };
      // Backend order is placed successfully

      // Save address if user checked "Save this information for next time"
      if (form.saveInfo) {
        const addressPayload = {
          fullName: `${form.firstName} ${form.lastName}`.trim() || user?.name || "Customer",
          phone: form.phone || user?.phoneNumber || user?.phone || "0000000000",
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: "India"
        };
        // Update live backend
        import('../../services/api').then(({ updateUserProfile }) => {
          updateUserProfile({ addresses: [addressPayload] }, token).catch(() => {});
        });
        
        // Update local storage so it persists if API is mocked/fails
        try {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          storedUser.addresses = [addressPayload];
          localStorage.setItem('user', JSON.stringify(storedUser));
        } catch (e) {}
      }

      setPlacedOrderTotal(finalTotal);
      setOrderStatus('success');
      clearCart();
    } else {
      setOrderStatus('error');
    }
  };

  if (!isLoggedIn) return null; // Prevent flicker before redirect

  if (orderStatus === 'success') {
    return (
      <div className="co-success-container">
        <motion.div 
          className="co-success-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="co-success-icon-wrap">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              <Check size={48} className="co-success-icon" />
            </motion.div>
          </div>
          
          <h1 className="co-success-title">Order Confirmed</h1>
          <p className="co-success-subtitle">Thank you for your order. We are preparing it for shipment.</p>
          
          <div className="co-success-divider" />
          
          <div className="co-success-details">
            <div className="co-success-detail-row">
              <span className="co-success-label">Payment Method</span>
              <span className="co-success-val">{paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : paymentMethod}</span>
            </div>
            <div className="co-success-detail-row">
              <span className="co-success-label">Delivery Address</span>
              <span className="co-success-val">{[form.address, form.city, form.pincode].filter(Boolean).join(', ')}</span>
            </div>
            <div className="co-success-detail-row">
              <span className="co-success-label">{paymentMethod === 'COD' ? 'Amount to Pay' : 'Total Paid'}</span>
              <span className="co-success-val">₹{placedOrderTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="co-success-divider" />
          
          <div className="co-success-actions">
            <Link to="/account" className="co-success-btn co-success-btn-primary">
              View Order History
            </Link>
            <Link to="/shop" className="co-success-btn co-success-btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {loadingCheckout && (
          <motion.div
            className="checkout-loader-backdrop"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "var(--white-7)",
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--ltn__heading-color)",
            }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", height: "150px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Road Track Line */}
              <div style={{ width: "100%", height: "2px", backgroundColor: "var(--border-color-1)", position: "absolute", bottom: "40px" }} />
              
              {/* Driving Truck Icon */}
              <motion.div
                initial={{ x: "-100px" }}
                animate={{
                  x: ["-100px", "170px", "170px", "450px"],
                }}
                transition={{
                  duration: 2.8,
                  times: [0, 0.35, 0.65, 1],
                  ease: ["easeOut", "easeInOut", "easeIn", "easeIn"]
                }}
                onAnimationComplete={() => setLoadingCheckout(false)}
                style={{
                  position: "absolute",
                  bottom: "42px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Truck size={42} color="var(--ltn__secondary-color)" />
                {/* Subtle dust particles */}
                <motion.div 
                  animate={{ opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--border-color-7)", position: "absolute", left: "-10px", bottom: "4px" }}
                />
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.8, times: [0, 0.2, 0.8, 1] }}
              style={{
                fontFamily: "var(--ltn__heading-font)",
                fontSize: "16px",
                letterSpacing: "2px",
                fontWeight: 400,
                textTransform: "uppercase",
                marginTop: "20px",
                textAlign: "center"
              }}
            >
              Securing your order...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>


      <button 
        className="co-mob" 
        onClick={() => setSummaryOpen(!summaryOpen)}
      >
        <div className="co-mob-left">
          <ShoppingCart size={16} />
          <span>{summaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
          <ChevronDown size={14} style={{ transform: summaryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
        </div>
        <div className="co-mob-right">
          ₹{finalTotal.toLocaleString('en-IN')}
        </div>
      </button>

      <div className={`co-mob-drawer ${summaryOpen ? 'co-mob-drawer--open' : ''}`}>
        <SummaryContent {...{ cartItems, cartTotal, shipping, discount, finalTotal, coupon, setCoupon, couponApplied, couponError, handleCoupon, getImage, getPrice, getId, isVerifyingCoupon, discountPercent }} />
      </div>

      <div className="co__grid">

        {/* ══ LEFT ══ */}
        <div className="co__left">
          <Link to="/" className="co__brand">UrbanWear</Link>

          {/* Breadcrumb */}
          <nav className="co__crumb">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <button
                  className={`co__crumb-step ${i === activeStep ? 'is-active' : ''} ${i < activeStep ? 'is-done' : ''} ${i > activeStep ? 'is-locked' : ''}`}
                  onClick={() => i < activeStep && setActiveStep(i)}
                >
                  <span className="co__crumb-dot">
                    {i < activeStep ? <Check size={10} strokeWidth={3} /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < 2 && <ChevronRight size={12} className="co__crumb-sep" />}
              </React.Fragment>
            ))}
          </nav>

          {/* ── Step 0: Contact ── */}
          {activeStep === 0 && (
            <div className="co__panel co__panel--enter">
              <div className="co__panel-head">
                <span className="co__badge">Step 1 of 3</span>
                <h2 className="co__panel-title">Contact</h2>
                <p className="co__panel-sub">Already have an account? <Link to="/login">Log in</Link></p>
              </div>
              <FloatField id="email" name="email" label="Email or mobile phone number" type="email" value={form.email} onChange={handleChange} error={errors.email} />
              <label className="co__check">
                <span className={`co__check-box ${form.newsletter ? 'co__check-box--on' : ''}`}>
                  {form.newsletter && <Check size={9} strokeWidth={3} />}
                </span>
                <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handleChange} style={{display:'none'}} />
                Email me with news and exclusive offers
              </label>
              <button className="co__cta" onClick={handleContinueToDelivery}>
                Continue to Delivery <ChevronRight size={15} />
              </button>
            </div>
          )}

          {activeStep > 0 && (
            <div className="co__collapsed" onClick={() => setActiveStep(0)}>
              <span className="co__collapsed-tag">Contact</span>
              <span className="co__collapsed-val">{form.email || '—'}</span>
              <span className="co__collapsed-edit">Edit</span>
            </div>
          )}

          {/* ── Step 1: Delivery ── */}
          {activeStep === 1 && (
            <div className="co__panel co__panel--enter">
              <div className="co__panel-head">
                <span className="co__badge">Step 2 of 3</span>
                <h2 className="co__panel-title">Delivery</h2>
              </div>

              <div className="ff ff--has">
                <select className="ff__input ff__select" defaultValue="India" disabled>
                  <option>India</option>
                </select>
                <label className="ff__label ff__label--up">Country / Region</label>
                <ChevronDown size={15} className="ff__arrow" />
                <span className="ff__bar" />
              </div>

              <div className="co__row-2">
                <FloatField id="firstName" name="firstName" label="First name" value={form.firstName} onChange={handleChange} optional />
                <FloatField id="lastName"  name="lastName"  label="Last name"  value={form.lastName}  onChange={handleChange} error={errors.lastName} />
              </div>

              <FloatField id="address"   name="address"   label="Address"    value={form.address}   onChange={handleChange} error={errors.address} />
              <FloatField id="apartment" name="apartment" label="Apartment, suite, etc." value={form.apartment} onChange={handleChange} optional />

              <div className="co__row-3">
                <FloatField id="city" name="city" label="City" value={form.city} onChange={handleChange} error={errors.city} />
                <FloatSelect id="state" name="state" label="State" value={form.state} onChange={handleChange}>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </FloatSelect>
                <FloatField id="pincode" name="pincode" label="PIN code" value={form.pincode} onChange={handleChange} error={errors.pincode} />
              </div>

              <label className="co__check">
                <span className={`co__check-box ${form.saveInfo ? 'co__check-box--on' : ''}`}>
                  {form.saveInfo && <Check size={9} strokeWidth={3} />}
                </span>
                <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} style={{display:'none'}} />
                Save this information for next time
              </label>

              <p className="co__subhead">Shipping method</p>
              {form.pincode.length === 6 ? (
                <div className="co__ship-card">
                  <span className="co__ship-radio" />
                  <div>
                    <p className="co__ship-name">Standard Delivery</p>
                    <p className="co__ship-eta">5–7 business days</p>
                  </div>
                  <span className="co__ship-price">{shipping === 0 ? <em className="co__free">Free</em> : `₹${shipping}`}</span>
                </div>
              ) : (
                <div className="co__info-pill">
                  <Truck size={14} /> Enter your PIN code to view shipping options
                </div>
              )}

              <button className="co__cta" onClick={handleContinueToPayment}>
                Continue to Payment <ChevronRight size={15} />
              </button>
            </div>
          )}

          {activeStep > 1 && (
            <div className="co__collapsed" onClick={() => setActiveStep(1)}>
              <span className="co__collapsed-tag">Ship to</span>
              <span className="co__collapsed-val">{[form.address, form.city, form.pincode].filter(Boolean).join(', ') || '—'}</span>
              <span className="co__collapsed-edit">Edit</span>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {activeStep === 2 && (
            <div className="co__panel co__panel--enter">
              <div className="co__panel-head">
                <span className="co__badge">Step 3 of 3</span>
                <h2 className="co__panel-title">Payment</h2>
                <span className="co__secure"><Lock size={11} /> Secure &amp; encrypted</span>
              </div>

              <p className="co__subhead">Select Payment Method</p>
              <div className="co__payment-options">
                {/* Cash on Delivery */}
                <div 
                  className={`co__pay-option ${paymentMethod === 'COD' ? 'co__pay-option--active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <span className={`co__pay-radio ${paymentMethod === 'COD' ? 'co__pay-radio--active' : ''}`} />
                  <div className="co__pay-details">
                    <span className="co__pay-name">Cash on Delivery (COD)</span>
                    <span className="co__pay-desc">Pay with cash upon delivery. No extra fees.</span>
                  </div>
                </div>

                {/* Online Payment (Disabled / Coming Soon) */}
                <div className="co__pay-option co__pay-option--disabled">
                  <span className="co__pay-radio" />
                  <div className="co__pay-details">
                    <span className="co__pay-name">Credit/Debit Card</span>
                    <span className="co__pay-desc">Pay securely with Visa, Mastercard, or RuPay. (Coming Soon)</span>
                  </div>
                </div>
                
                {/* UPI (Disabled / Coming Soon) */}
                <div className="co__pay-option co__pay-option--disabled">
                  <span className="co__pay-radio" />
                  <div className="co__pay-details">
                    <span className="co__pay-name">UPI / Net Banking</span>
                    <span className="co__pay-desc">Pay instantly using your UPI ID or netbanking account. (Coming Soon)</span>
                  </div>
                </div>
              </div>

              <button 
                className={`co__cta ${isSubmitting ? 'co__cta--disabled' : ''}`} 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order · ₹${finalTotal.toLocaleString('en-IN')}`}
              </button>

              <div className="co__trust">
                <span><ShieldCheck size={13} /> SSL secured</span>
                <span className="co__trust-dot" />
                <span><RotateCcw size={13} /> Easy returns</span>
                <span className="co__trust-dot" />
                <span><Truck size={13} /> Fast delivery</span>
              </div>
            </div>
          )}

          <p className="co__footer">© {new Date().getFullYear()} UrbanWear. All rights reserved.</p>
        </div>

        {/* ══ RIGHT ══ */}
        <aside className="co__right">
          <div className="co__right-inner">
            <SummaryContent {...{ cartItems, cartTotal, shipping, discount, finalTotal, coupon, setCoupon, couponApplied, couponError, handleCoupon, getImage, getPrice, getId, isVerifyingCoupon, discountPercent }} />
          </div>
        </aside>

      </div>
    </>
  );
};

const SummaryContent = ({ cartItems, cartTotal, shipping, discount, finalTotal, coupon, setCoupon, couponApplied, couponError, handleCoupon, getImage, getPrice, getId, isVerifyingCoupon, discountPercent }) => (
  <div className="co__summary">
    {cartItems.length === 0 ? (
      <p className="co__empty">Cart is empty. <Link to="/shop">Browse the store →</Link></p>
    ) : (
      <ul className="co__items">
        {cartItems.map(item => (
          <li key={getId(item)} className="co__item">
            <div className="co__item-img">
              <img src={getImage(item)} alt={item.name} loading="lazy" />
              <span className="co__item-qty">{item.quantity}</span>
            </div>
            <div className="co__item-info">
              <p className="co__item-name">{item.name}</p>
              {item.selectedSize && <p className="co__item-size">Size: {item.selectedSize}</p>}
            </div>
            <p className="co__item-price">₹{(getPrice(item) * item.quantity).toLocaleString('en-IN')}</p>
          </li>
        ))}
      </ul>
    )}

    <div className="co__coupon">
      <div className="co__coupon-field">
        <Tag size={14} />
        <input
          className="co__coupon-input"
          placeholder="Discount or gift card code"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
          disabled={couponApplied}
        />
      </div>
      <button className={`co__coupon-btn ${couponApplied ? 'co__coupon-btn--ok' : ''}`} onClick={handleCoupon} disabled={couponApplied || isVerifyingCoupon}>
        {isVerifyingCoupon ? '...' : (couponApplied ? <Check size={14} /> : 'Apply')}
      </button>
    </div>
    {couponError   && <p className="co__coupon-err">Invalid or expired coupon code</p>}
    {couponApplied && <p className="co__coupon-ok">{coupon.toUpperCase()} applied — {discountPercent}% off!</p>}

    <div className="co__divider" />
    <div className="co__sum-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
    {discount > 0 && <div className="co__sum-row co__sum-row--discount"><span>Discount ({coupon.toUpperCase()})</span><span>−₹{discount.toLocaleString('en-IN')}</span></div>}
    <div className="co__sum-row">
      <span>Shipping</span>
      <span>{shipping === 0 ? <em className="co__free">Free</em> : `₹${shipping}`}</span>
    </div>
    <div className="co__divider" />

    <div className="co__total">
      <div><span className="co__total-label">Total</span><span className="co__total-cur"> INR</span></div>
      <span className="co__total-amt">₹{finalTotal.toLocaleString('en-IN')}</span>
    </div>
    {cartTotal > 999 && <div className="co__free-note">🎉 You qualify for free shipping!</div>}
  </div>
);

export default Checkout;