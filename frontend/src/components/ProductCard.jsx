import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSplat, SplatParticles } from './SplatEffect';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const wishlisted = isWishlisted(product.id);
  const inCart = cartItems.some(item => item.id === product.id);

  const { trigger: triggerWishSplat, particles: wishParticles } = useSplat();
  const { trigger: triggerCartSplat, particles: cartParticles } = useSplat();

  const [wishSplat, setWishSplat] = useState(false);
  const [cartSplat, setCartSplat] = useState(false);

  const triggerSplat = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 450);
  };

  return (
    <div className="ltn__product-item">
      {/* Product Image */}
      <div className="product-img">
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} alt={product.name} />
        </Link>
        <div className="product-hover-action">
          <ul>
            <li>
              <button type="button" title="Quick View">
                <Eye size={16} />
              </button>
            </li>
            <li style={{ position: 'relative' }}>
              <button
                type="button"
                title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                className={`${wishlisted ? 'wishlisted' : ''} ${wishSplat ? 'splat-bounce' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product);
                  triggerSplat(setWishSplat);
                  triggerWishSplat(wishlisted ? '#aaaaaa' : '#f24c5c', 12);
                }}
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <SplatParticles particles={wishParticles} />
            </li>
            <li style={{ position: 'relative' }}>
              <button
                type="button"
                title={inCart ? "Remove from Cart" : "Add to Cart"}
                className={`${inCart ? 'incart' : ''} ${cartSplat ? 'splat-bounce' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (inCart) {
                    removeFromCart(product.id);
                    triggerCartSplat('#aaaaaa', 14);
                  } else {
                    addToCart(product, 1);
                    triggerCartSplat('var(--ltn__primary-color)', 20);
                  }
                  triggerSplat(setCartSplat);
                }}
              >
                <ShoppingCart size={16} fill={inCart ? 'currentColor' : 'none'} />
              </button>
              <SplatParticles particles={cartParticles} />
            </li>
          </ul>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h2>
        <div className="product-price">
          <span>₹{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
