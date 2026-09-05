import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { fetchSettings } from '../../services/api';
import { getColorName } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [pincode, setPincode] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState(null);
  const [storeSettings, setStoreSettings] = useState({ shippingCost: 99, freeShippingThreshold: 2500 });

  useEffect(() => {
    fetchSettings().then(res => {
      if (res && res.success && res.data) {
        setStoreSettings({
          shippingCost: res.data.shippingCost ?? 99,
          freeShippingThreshold: res.data.freeShippingThreshold ?? 2500
        });
      }
    });
  }, []);

  const handleCalculateShipping = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setShippingEstimate({ type: 'error', message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    const cost = cartTotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.shippingCost;
    setShippingEstimate({ 
      type: 'success', 
      message: cost === 0 ? 'Eligible for Free Shipping!' : `Estimated Shipping: ₹${cost}` 
    });
  };

  const getImage = (item) =>
    item?.images?.[0]?.url || item?.images?.[0] || 'https://placehold.co/120x150?text=Item';

  const getPrice = (item) => item?.discountPrice || item?.price || 0;

  const getId = (item) => item?._id || item?.id;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Your shopping cart</h1>
        </div>
        <div className="cart-empty">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2>Your cart is empty</h2>
          <p>Add some products to get started.</p>
          <Link to="/shop" className="cart-continue-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Your shopping cart</h1>
      </div>

      <div className="cart-page-body">
        {/* Items Table */}
        <div className="cart-items-section">
          <div className="cart-table-head">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {cartItems.map(item => (
            <div key={getId(item)} className="cart-row">
              <div className="cart-row-product">
                <img src={getImage(item)} alt={item.name} className="cart-row-img" />
                <div className="cart-row-info">
                  <Link to={`/product/${getId(item)}`} className="cart-row-name">{item.name}</Link>
                  {(item.size || item.color) && (
                    <span className="cart-row-variant" style={{ color: "var(--ltn__paragraph-color)", fontSize: "13px" }}>
                      {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color && `Color: ${item.color.startsWith('#') ? getColorName(item.color) : item.color}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="cart-row-price">
                ₹{getPrice(item).toLocaleString('en-IN')}
              </div>

              <div className="cart-row-qty">
                <button onClick={() => updateQuantity(getId(item), item.quantity - 1, item.size, item.color)}>
                  <Minus size={12} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(getId(item), item.quantity + 1, item.size, item.color)}>
                  <Plus size={12} />
                </button>
              </div>

              <div className="cart-row-total">
                ₹{(getPrice(item) * item.quantity).toLocaleString('en-IN')}
              </div>

              <button className="cart-row-remove" onClick={() => removeFromCart(getId(item), item.size, item.color)}>
                <X size={16} />
              </button>
            </div>
          ))}

          <div className="cart-actions">
            <Link to="/shop" className="cart-continue-btn">Continue Shopping</Link>
            <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        {/* Bottom: Shipping + Totals */}
        <div className="cart-bottom-row">
          {/* Shipping Estimate */}
          <div className="cart-shipping">
            <h3>Get shipping estimates</h3>
            <input
              type="text"
              placeholder="Zip / Postal Code"
              value={pincode}
              onChange={e => {
                setPincode(e.target.value);
                setShippingEstimate(null);
              }}
              className="cart-shipping-input"
            />
            <button className="cart-shipping-btn" onClick={handleCalculateShipping}>Calculate shipping</button>
            {shippingEstimate && (
              <p style={{ marginTop: '10px', fontSize: '14px', color: shippingEstimate.type === 'error' ? 'red' : 'green' }}>
                {shippingEstimate.message}
              </p>
            )}
          </div>

          {/* Cart Totals */}
          <div className="cart-totals">
            <h3>Cart Totals</h3>
            <table className="cart-totals-table">
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>₹{cartTotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="cart-totals-total">
                  <td>Total</td>
                  <td>₹{cartTotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            <Link to="/checkout" className="cart-checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
