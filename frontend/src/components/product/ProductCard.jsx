import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  useSplat,
  SplatParticles
} from '../ui/SplatEffect';
import AddToCartPopup from './AddToCartPopup';

import './ProductCard.css';

const ProductCard = ({ product, badgeText }) => {
  const { toggleWishlist, isWishlisted } =
    useWishlist();

  const {
    cartItems,
    addToCart,
    removeFromCart
  } = useCart();

  // Support backend _id
  const productId =
    product?._id || product?.id;

  // Safe values
  const productName =
    product?.name || 'Unnamed Product';

  const productImage =
    product?.images?.[0]?.url ||
    'https://placehold.co/400x500?text=No+Image';

  const productImage2 =
    product?.images?.[1]?.url;

  const productPrice =
    product?.discountPrice ||
    product?.price ||
    0;

  const originalPrice =
    product?.price || 0;

  const wishlisted =
    isWishlisted(productId);

  const inCart = cartItems.some(
    item =>
      (item._id || item.id) ===
      productId
  );

  // Badge display
  const isTrending = product?.isTrending || false;
  const showBadge = badgeText || (isTrending ? '🔥 Trending' : '');

  // Rating values
  const ratingVal = typeof product?.rating === 'object'
    ? product.rating?.average
    : product?.rating;
  const ratingCount = typeof product?.rating === 'object'
    ? product.rating?.count
    : product?.reviewCount;

  // Particle effects
  const {
    trigger: triggerWishSplat,
    particles: wishParticles
  } = useSplat();

  const {
    trigger: triggerCartSplat,
    particles: cartParticles
  } = useSplat();

  const [wishSplat, setWishSplat] = useState(false);
  const [cartSplat, setCartSplat] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const triggerSplat = setter => {
    setter(true);

    setTimeout(() => {
      setter(false);
    }, 450);
  };

  const handleWishlist = e => {
    e.preventDefault();

    toggleWishlist(product);

    triggerSplat(setWishSplat);

    triggerWishSplat(
      wishlisted
        ? '#aaaaaa'
        : '#f24c5c',
      12
    );
  };

  const handleCart = e => {
    e.preventDefault();
    const defaultSize = product?.sizes?.[0] || '';
    const defaultColor = product?.colors?.[0] || '';
    addToCart(product, 1, defaultSize, defaultColor);
    triggerCartSplat('var(--ltn__primary-color)', 20);
    setShowPopup(true);
    triggerSplat(setCartSplat);
  };

  return (
    <>
      <div className="ltn__product-item">
      {/* Product Image */}
      <div className="product-img">
        {showBadge && (
          <span className={`product-card-badge ${showBadge.includes('Trending') ? 'trending' : ''}`}>
            {showBadge}
          </span>
        )}
        <Link
          to={`/product/${productId}`}
        >
          <img
            src={productImage}
            alt={productName}
            loading="lazy"
            className={productImage2 ? "primary-img" : ""}
          />
          {productImage2 && (
            <img
              src={productImage2}
              alt={`${productName} alternate`}
              loading="lazy"
              className="hover-img"
            />
          )}
        </Link>

        {/* Hover Actions */}
        <div className="product-hover-action">
          <ul>
            {/* Quick View */}
            <li>
              <motion.button
                type="button"
                title="Quick View"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.85 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Eye size={16} />
              </motion.button>
            </li>

            {/* Wishlist */}
            <li
              style={{
                position: 'relative'
              }}
            >
              <motion.button
                type="button"
                title={
                  wishlisted
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'
                }
                className={`
                  ${
                    wishlisted
                      ? 'wishlisted'
                      : ''
                  }
                  ${
                    wishSplat
                      ? 'splat-bounce'
                      : ''
                  }
                `}
                onClick={
                  handleWishlist
                }
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.85 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Heart
                  size={16}
                  fill={
                    wishlisted
                      ? 'var(--ltn__secondary-color, #f24c5c)'
                      : 'none'
                  }
                  color={
                    wishlisted
                      ? 'var(--ltn__secondary-color, #f24c5c)'
                      : 'currentColor'
                  }
                  style={{ transition: 'fill 0.3s ease, color 0.3s ease' }}
                />
              </motion.button>

              <SplatParticles
                particles={
                  wishParticles
                }
              />
            </li>

            {/* Cart */}
            <li
              style={{
                position: 'relative'
              }}
            >
              <motion.button
                type="button"
                title="Add to Cart"
                className={`
                  ${
                    inCart
                      ? 'incart'
                      : ''
                  }
                  ${
                    cartSplat
                      ? 'splat-bounce'
                      : ''
                  }
                `}
                onClick={handleCart}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.85 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={inCart ? 'check' : 'cart'}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {inCart ? (
                      <Check size={16} color="var(--ltn__secondary-color, #f24c5c)" />
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <SplatParticles
                particles={
                  cartParticles
                }
              />
            </li>
          </ul>
        </div>

        {/* Hover Sizes */}
        {product?.sizes?.length > 0 && (
          <div className="product-card-sizes">
            <span style={{ width: '100%', textAlign: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--ltn__paragraph-color)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sizes</span>
            {product.sizes.map(size => (
              <span key={size} className="product-card-size-item">{size}</span>
            ))}
          </div>
        )}
      </div>


      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">
          <Link
            to={`/product/${productId}`}
          >
            {productName}
          </Link>
        </h2>

        {ratingVal > 0 && (
          <div className="product-card-rating">
            <Star size={12} fill="#ffb300" color="#ffb300" className="star-icon" />
            <span className="rating-value">{ratingVal}</span>
            {ratingCount > 0 && <span className="rating-count">({ratingCount})</span>}
          </div>
        )}

        <div className="product-price">
          <span>
            ₹
            {productPrice.toLocaleString(
              'en-IN'
            )}
          </span>

          {product.discountPrice &&
            originalPrice >
              product.discountPrice && (
              <del
                style={{
                  marginLeft: '10px',
                  opacity: 0.7
                }}
              >
                ₹
                {originalPrice.toLocaleString(
                  'en-IN'
                )}
              </del>
            )}
        </div>
      </div>
    </div>

      {showPopup && (
        <AddToCartPopup
          product={product}
          quantity={1}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
