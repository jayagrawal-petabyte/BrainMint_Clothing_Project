import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page">
      {/* Header */}
      <div className="wishlist-header">
        <div className="wishlist-eyebrow">
          <span className="eyebrow-dash" />
          <span className="eyebrow-text">Saved Collection</span>
        </div>
        <h1 className="wishlist-heading">My Wishlist</h1>
        <p className="wishlist-sub">Your curated collection of favorite styles.</p>
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
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              {/* Image */}
              <div className="wishlist-card-img">
                <img src={item.images[0]} alt={item.name} />
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  <Heart size={18} fill="#f24c5c" color="#f24c5c" />
                </button>
              </div>

              {/* Content */}
              <div className="wishlist-card-body">
                <h3 className="wishlist-card-name">{item.name}</h3>
                <p className="wishlist-card-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
                <button
                  className="wishlist-move-btn"
                  onClick={() => addToCart(item, 1)}
                >
                  <ShoppingCart size={18} />
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;