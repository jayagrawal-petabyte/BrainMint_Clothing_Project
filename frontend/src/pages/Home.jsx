import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Home.css';

const Home = () => {
  // Get 4 new arrivals
  const newArrivals = mockProducts.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge">🔥 NEW DROP 2026</span>

          <h1>
            Streetwear <br />
            Redefined
          </h1>

          <p>
            Discover oversized tees, premium hoodies,
            cargo pants, and timeless essentials for
            modern urban fashion.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="shop-btn">Shop Collection</Link>
            <Link to="/shop" className="explore-btn">Explore Trends</Link>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234"
            alt="Fashion Model"
          />
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="featured-categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" alt="T-Shirts" />
            <div className="category-content">
              <h3>T-Shirts</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" alt="Hoodies" />
            <div className="category-content">
              <h3>Hoodies</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" alt="Pants" />
            <div className="category-content">
              <h3>Pants</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" alt="Jackets" />
            <div className="category-content">
              <h3>Jackets</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals Row */}
      <section className="new-arrivals">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/shop" className="view-all-link">View All</Link>
        </div>
        <div className="new-arrivals-row">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
