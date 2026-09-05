
import { Link } from 'react-router-dom';
import './PromoBanner.css';

const PromoBanner = () => {
  return (
    <div className="promo-banner-container">
      <div className="promo-banner-bg">
        <div className="promo-banner-content">
          <span className="promo-eyebrow">Limited Time Offer</span>
          <h2>Summer Sale</h2>
          <p>Up to 50% off on selected items. Upgrade your wardrobe with our latest summer collection.</p>
          <Link to="/shop?sale=true" className="promo-btn">
            Shop The Sale
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
