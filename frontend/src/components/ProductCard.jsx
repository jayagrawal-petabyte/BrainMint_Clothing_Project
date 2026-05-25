import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="ltn__product-item">
      {/* Product Image */}
      <div className="product-img">
        <a href="#">
          <img src={product.images[0]} alt={product.name} />
        </a>
        <div className="product-hover-action">
          <ul>
            <li>
              <a href="#" title="Quick View">
                <Eye size={16} />
              </a>
            </li>
            <li>
              <a href="#" title="Add to Wishlist">
                <Heart size={16} />
              </a>
            </li>
            <li>
              <a href="#" title="Add to Cart">
                <ShoppingCart size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">
          <a href="#">{product.name}</a>
        </h2>
        <div className="product-price">
          <span>${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
