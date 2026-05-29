import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';

import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
  useSplat,
  SplatParticles
} from './SplatEffect';

import './ProductCard.css';

const ProductCard = ({ product }) => {
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

  // Particle effects
  const {
    trigger: triggerWishSplat,
    particles: wishParticles
  } = useSplat();

  const {
    trigger: triggerCartSplat,
    particles: cartParticles
  } = useSplat();

  const [wishSplat, setWishSplat] =
    useState(false);

  const [cartSplat, setCartSplat] =
    useState(false);

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

    if (inCart) {
      removeFromCart(productId);

      triggerCartSplat(
        '#aaaaaa',
        14
      );
    } else {
      addToCart(product, 1);

      triggerCartSplat(
        'var(--ltn__primary-color)',
        20
      );
    }

    triggerSplat(setCartSplat);
  };

  return (
    <div className="ltn__product-item">
      {/* Product Image */}
      <div className="product-img">
        <Link
          to={`/product/${productId}`}
        >
          <img
            src={productImage}
            alt={productName}
            loading="lazy"
          />
        </Link>

        {/* Hover Actions */}
        <div className="product-hover-action">
          <ul>
            {/* Quick View */}
            <li>
              <button
                type="button"
                title="Quick View"
              >
                <Eye size={16} />
              </button>
            </li>

            {/* Wishlist */}
            <li
              style={{
                position: 'relative'
              }}
            >
              <button
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
              >
                <Heart
                  size={16}
                  fill={
                    wishlisted
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>

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
              <button
                type="button"
                title={
                  inCart
                    ? 'Remove from Cart'
                    : 'Add to Cart'
                }
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
              >
                <ShoppingCart
                  size={16}
                  fill={
                    inCart
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>

              <SplatParticles
                particles={
                  cartParticles
                }
              />
            </li>
          </ul>
        </div>
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
  );
};

export default ProductCard;