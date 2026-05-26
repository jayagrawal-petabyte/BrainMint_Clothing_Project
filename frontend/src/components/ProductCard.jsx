import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
            <li>
              <button type="button" title="Add to Wishlist">
                <Heart size={16} />
              </button>
            </li>
            <li>
              <button type="button" title="Add to Cart">
                <ShoppingCart size={16} />
              </button>
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
