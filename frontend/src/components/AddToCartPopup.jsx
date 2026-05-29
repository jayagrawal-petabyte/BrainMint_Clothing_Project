import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import './AddToCartPopup.css';

const AddToCartPopup = ({ product, quantity = 1, onClose }) => {
  const productId = product?._id || product?.id;
  const productName = product?.name || 'Product';
  const productImage =
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    'https://placehold.co/80x100?text=Item';
  const price = product?.discountPrice || product?.price || 0;

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div className="atc-backdrop" onClick={onClose}>
      <div className="atc-popup" onClick={e => e.stopPropagation()}>
        <button className="atc-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="atc-header">
          <CheckCircle size={20} className="atc-check" />
          <span>Successfully added to your Cart</span>
        </div>

        <div className="atc-product">
          <img src={productImage} alt={productName} className="atc-img" />
          <div className="atc-info">
            <p className="atc-name">{productName}</p>
            <p className="atc-qty">Qty: {quantity}</p>
            <p className="atc-price">₹{(price * quantity).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="atc-actions">
          <Link to="/cart" className="atc-btn-view" onClick={onClose}>
            View Cart
          </Link>
          <Link to="/checkout" className="atc-btn-checkout" onClick={onClose}>
            Checkout
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddToCartPopup;
