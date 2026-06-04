import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { fetchProductReviews, submitProductReview } from '../../services/api';
import './ProductTabs.css';

const TABS = ['Description', 'Reviews', 'Shipping Policy'];

const ProductTabs = ({ productId }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'Reviews' && productId) {
      loadReviews();
    }
  }, [activeTab, productId]);

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    const data = await fetchProductReviews(productId);
    setReviews(data || []);
    setIsLoadingReviews(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
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
    } else {
      setSubmitMessage('Failed to submit review. You may have already reviewed this product.');
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
          <div className="tab-pane">
            <div className="reviews-section">
              <div className="reviews-list mb-8">
                <h3 className="text-xl font-bold mb-4 font-montserrat">Customer Reviews</h3>
                {isLoadingReviews ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-1 mb-2 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="font-semibold text-sm mb-1">{rev.name || rev.user?.name || 'Customer'}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{rev.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="review-form-container bg-white dark:bg-[#222] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h4 className="text-lg font-bold mb-4 font-montserrat">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className={`${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        >
                          <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Review</label>
                    <textarea 
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-transparent text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
                      rows="4"
                      placeholder="What did you think about this product?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {submitMessage && (
                    <p className={`text-sm mt-2 ${submitMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
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
            <h4>Free Standard Shipping</h4>
            <p>We offer free standard shipping on all orders above ₹999. Orders are processed within 1–2 business days and typically arrive within 5–7 business days.</p>
            <h4>Express Shipping</h4>
            <p>Express shipping is available for an additional fee. Express orders are delivered within 2–3 business days.</p>
            <h4>Returns</h4>
            <p>We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in their original packaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
