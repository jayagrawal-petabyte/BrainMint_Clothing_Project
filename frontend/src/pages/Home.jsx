import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import TrustBadges from '../components/TrustBadges';
import { mockProducts } from '../data/products';
import './Home.css';

const Home = () => {
  const newArrivals = mockProducts.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge hero-text-animate">NEW COLLECTION</span>

          <h1 className="hero-text-animate fade-up-delay-0">
            Elegance <br />
            Redefined
          </h1>

          <p className="hero-text-animate fade-up-delay-1">
            Discover curated collections of timeless essentials,
            delicate dresses, and modern silhouettes for
            the contemporary woman.
          </p>

          <div className="mini-category-pills hero-text-animate fade-up-delay-2">
            <Link to="/shop?category=dresses" className="mini-pill">Dresses</Link>
            <Link to="/shop?category=essentials" className="mini-pill">Essentials</Link>
            <Link to="/shop?category=jackets" className="mini-pill">Jackets</Link>
            <Link to="/shop?category=accessories" className="mini-pill">Accessories</Link>
          </div>

          <div className="hero-buttons hero-text-animate fade-up-delay-3">
            <Link to="/shop" className="shop-btn">Shop Collection</Link>
            <Link to="/shop" className="explore-btn">Explore Trends</Link>
          </div>

          <div className="hero-stats hero-text-animate fade-up-delay-4">
            <span>10K+ Customers</span>
            <span className="stat-divider">|</span>
            <span>4.9★ Reviews</span>
            <span className="stat-divider">|</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper floating-element">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Fashion Model"
            />
          </div>
        </div>
      </section>

      <section className="featured-categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500" alt="Dresses" />
            <div className="category-content">
              <h3>Dresses</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500" alt="Tops" />
            <div className="category-content">
              <h3>Tops</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" alt="Skirts" />
            <div className="category-content">
              <h3>Skirts</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" alt="Accessories" />
            <div className="category-content">
              <h3>Accessories</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

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

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  );
};

export default Home;
