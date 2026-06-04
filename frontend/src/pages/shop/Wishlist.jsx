import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import AddToCartPopup from "../../components/product/AddToCartPopup";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="wishlist-page">
      {/* Header */}
      <div className="wishlist-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div className="wishlist-eyebrow">
          <span className="eyebrow-dash" />
          <span className="eyebrow-text">Saved Collection</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="wishlist-heading" style={{ marginBottom: '5px' }}>My Wishlist</h1>
            <p className="wishlist-sub" style={{ margin: 0 }}>Your curated collection of favorite styles.</p>
          </div>
          {wishlistItems.length > 0 && (
            <button 
              onClick={clearWishlist}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--border-color-1)', 
                color: 'var(--ltn__paragraph-color)',
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: '13px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--ltn__secondary-color)';
                e.currentTarget.style.color = 'var(--ltn__secondary-color)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color-1)';
                e.currentTarget.style.color = 'var(--ltn__paragraph-color)';
              }}
            >
              Clear Wishlist
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <Heart size={55} strokeWidth={1.5} className="empty-heart" />
          <h2 className="empty-title">Your Wishlist is Empty</h2>
          <p className="empty-sub">Save styles you love and revisit them anytime.</p>
          <Link to="/shop" className="wishlist-explore-btn">Explore Collection</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            const itemId = item._id || item.id;
            const itemImage = item?.images?.[0]?.url || item?.images?.[0] || 'https://placehold.co/400x500?text=No+Image';
            const itemPrice = item?.discountPrice || item?.price || 0;

            return (
            <div key={itemId} className="wishlist-card">
              {/* Image */}
              <div className="wishlist-card-img">
                <img src={itemImage} alt={item.name} />
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(itemId)}
                  title="Remove from wishlist"
                >
                  <Heart size={18} fill="#f24c5c" color="#f24c5c" />
                </button>
              </div>

              {/* Content */}
              <div className="wishlist-card-body">
                <h3 className="wishlist-card-name">{item.name}</h3>
                <p className="wishlist-card-price">
                  ₹{itemPrice.toLocaleString("en-IN")}
                </p>
                <button
                  className="wishlist-move-btn"
                  onClick={() => {
                    addToCart(item, 1);
                    setSelectedProduct(item);
                  }}
                >
                  <ShoppingCart size={18} />
                  Move to Cart
                </button>
              </div>
            </div>
          )})}
        </div>
      )}

      {selectedProduct && (
        <AddToCartPopup
          product={selectedProduct}
          quantity={1}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Wishlist;
