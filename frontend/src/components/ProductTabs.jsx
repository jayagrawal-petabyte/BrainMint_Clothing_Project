import { useState } from 'react';
import './ProductTabs.css';

const TABS = ['Description', 'Reviews', 'Shipping Policy'];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('Description');

  return (
    <div className="product-tabs">
      <div className="tabs-header">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'Description' && (
          <div className="tab-pane">
            <h4>Separated they live in Bookmarksgrove right</h4>
            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
            <h4>It is a paradisematic country</h4>
            <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
            <h4>Powerful Pointing</h4>
            <p>Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life. One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="tab-pane reviews-placeholder">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}

        {activeTab === 'Shipping Policy' && (
          <div className="tab-pane">
            <h4>Free Standard Shipping</h4>
            <p>We offer free standard shipping on all orders above ₹999. Orders are processed within 1â€“2 business days and typically arrive within 5â€“7 business days.</p>
            <h4>Express Shipping</h4>
            <p>Express shipping is available for an additional fee. Express orders are delivered within 2â€“3 business days.</p>
            <h4>Returns</h4>
            <p>We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in their original packaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
