import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
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

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const [form, setForm] = useState({
    email: '', newsletter: false,
    firstName: '', lastName: '',
    address: '', apartment: '',
    city: '', state: 'Uttar Pradesh', pincode: '',
    saveInfo: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login but save the current location so they come back after login
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const getImage = (item) =>
    item?.images?.[0]?.url || item?.images?.[0] || 'https://placehold.co/64x80?text=Item';

  const getPrice = (item) => item?.discountPrice || item?.price || 0;

  const getId = (item) => item?._id || item?.id;

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
        address: form.address,
        city: form.city,
        postalCode: form.pincode,
        country: "India" // Default for now
      },
      paymentMethod: "PayPal", // Hardcoded mock
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: cartTotal
    };

    const response = await placeOrder(orderData, token);

    setIsSubmitting(false);

    // The backend person3 implementation might return different shapes, assuming standard here:
    if (response && response.success !== false) {
      setOrderStatus('success');
      clearCart();
    } else {
      setOrderStatus('error');
    }
  };

  if (!isLoggedIn) return null; // Prevent flicker before redirect

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        {/* LEFT: Form */}
        <div className="checkout-form-col">
          <Link to="/" className="checkout-brand">UrbanWear</Link>

          {/* Contact */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Contact</h2>
            <input
              type="email"
              name="email"
              placeholder="Email or mobile phone number"
              value={form.email}
              onChange={handleChange}
              className="checkout-input full"
            />
            <label className="checkout-checkbox">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
              />
              Email me with news and offers
            </label>
          </section>

          {/* Delivery */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Delivery</h2>

            <select name="country" className="checkout-input full checkout-select" defaultValue="India">
              <option>India</option>
            </select>

            <div className="checkout-row">
              <input
                type="text"
                name="firstName"
                placeholder="First name (optional)"
                value={form.firstName}
                onChange={handleChange}
                className="checkout-input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className="checkout-input"
              />
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="checkout-input full"
            />
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              value={form.apartment}
              onChange={handleChange}
              className="checkout-input full"
            />

            <div className="checkout-row checkout-row-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="checkout-input"
              />
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="checkout-input checkout-select"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="text"
                name="pincode"
                placeholder="PIN code"
                value={form.pincode}
                onChange={handleChange}
                className="checkout-input"
              />
            </div>

            <label className="checkout-checkbox">
              <input
                type="checkbox"
                name="saveInfo"
                checked={form.saveInfo}
                onChange={handleChange}
              />
              <span>Save this information for next time</span>
            </label>
          </section>

          {/* Shipping Method */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Shipping method</h2>
            <div className="checkout-info-box">
              Enter your shipping address to view available shipping methods.
            </div>
          </section>

          {/* Payment */}
          <section className="checkout-section">
            <h2 className="checkout-section-title">Payment</h2>
            <p className="checkout-payment-sub">All transactions are secure and encrypted.</p>
            <div className="checkout-payment-box">
              <ShieldCheck size={40} strokeWidth={1} className="checkout-payment-icon" />
              <p>This store can't accept payments right now.</p>
            </div>
          </section>

          <button 
            className="checkout-pay-btn" 
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || isSubmitting}
            style={{ opacity: cartItems.length === 0 || isSubmitting ? 0.7 : 1, cursor: cartItems.length === 0 || isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>

          {orderStatus === 'success' && (
             <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e6ffe6', color: '#006600', border: '1px solid #00cc00', borderRadius: '4px' }}>
                Successfully placed order! You will be redirected shortly.
             </div>
          )}
          {orderStatus === 'error' && (
             <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffe6e6', color: '#cc0000', border: '1px solid #ff0000', borderRadius: '4px' }}>
                Failed to place order. Please try again.
             </div>
          )}

          <p className="checkout-footer-note">All rights reserved UrbanWear</p>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="checkout-summary-col">
          <div className="checkout-summary-inner">
            {cartItems.length === 0 ? (
              <p className="checkout-empty">No items in cart. <Link to="/shop">Shop now</Link></p>
            ) : (
              cartItems.map(item => (
                <div key={getId(item)} className="checkout-summary-item">
                  <div className="checkout-summary-img-wrap">
                    <img src={getImage(item)} alt={item.name} />
                    <span className="checkout-summary-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary-info">
                    <p className="checkout-summary-name">{item.name}</p>
                    {item.selectedSize && <p className="checkout-summary-variant">{item.selectedSize}</p>}
                  </div>
                  <p className="checkout-summary-price">
                    ₹{(getPrice(item) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span className="checkout-summary-muted">Enter shipping address</span>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-total">
              <span>Total</span>
              <span>
                <small>INR </small>
                <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
