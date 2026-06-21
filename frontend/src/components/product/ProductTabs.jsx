import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { fetchProductReviews, submitProductReview, fetchSettings } from '../../services/api';
import './ProductTabs.css';

const TABS = ['Reviews', 'Shipping Policy'];

const ProductTabs = ({ productId, onReviewAdded }) => {
  const [activeTab, setActiveTab] = useState('Reviews');
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Store settings for shipping info
  const [storeSettings, setStoreSettings] = useState({ shippingCost: 99, freeShippingThreshold: 2500 });

  useEffect(() => {
    if (activeTab === 'Reviews' && productId) {
      loadReviews();
    }
  }, [activeTab, productId]);

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

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    const data = await fetchProductReviews(productId);
    setReviews(data || []);
    setIsLoadingReviews(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('princess_token');
    if (!token) {
      setSubmitMessage('Please log in to submit a review.');
      return;
    }

    if (!comment.trim()) {
      setSubmitMessage('Please enter a review comment.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitProductReview(productId, { rating, comment }, token);
    setIsSubmitting(false);

    if (res && res.success !== false) {
      setSubmitMessage('Review submitted successfully!');
      setComment('');
      setRating(5);
      loadReviews(); // reload to show the new review
      if (onReviewAdded) onReviewAdded(); // trigger parent refresh to update rating
    } else {
      setSubmitMessage(res?.message || 'Failed to submit review. You may have already reviewed this product.');
    }
  };

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
        {activeTab === 'Reviews' && (
          <div className="tab-pane">
            <div className="reviews-section">
              <div className="reviews-list">
                <h3 className="reviews-title">Customer Reviews</h3>
                {isLoadingReviews ? (
                  <div className="reviews-loader">
                    <Loader2 className="spinner" size={32} />
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="reviews-empty">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="reviews-items">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="review-card">
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? "#f5a623" : "none"} color={i < rev.rating ? "#f5a623" : "#e0e0e0"} />
                          ))}
                        </div>
                        <p className="review-author">{rev.name || rev.user?.name || 'Customer'}</p>
                        <p className="review-comment">{rev.comment}</p>
                        <p className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="review-form-container">
                <h4 className="reviews-title">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className={`star-btn ${star <= rating ? 'active' : ''}`}
                        >
                          <Star size={24} fill={star <= rating ? "#f5a623" : "none"} color={star <= rating ? "#f5a623" : "#e0e0e0"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="review-textarea"
                      rows="4"
                      placeholder="What did you think about this product?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-review-btn"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {submitMessage && (
                    <p className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                      {submitMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Shipping Policy' && (
          <div className="tab-pane">
            <h4>Standard Shipping</h4>
            <p>We offer free standard shipping on all orders above ₹{storeSettings.freeShippingThreshold.toLocaleString('en-IN')}. A flat shipping charge of ₹{storeSettings.shippingCost.toLocaleString('en-IN')} applies to orders below this amount. Orders are processed within 1–2 business days and typically arrive within 5–7 business days.</p>
            <h4>Express Shipping</h4>
            <p>Express shipping is available for an additional fee. Express orders are delivered within 5-7 business days.</p>
            <h4>Returns</h4>
            <p>We currently do not accept any returns or exchanges. All sales are final.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
