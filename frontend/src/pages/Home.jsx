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
          <span className="hero-badge">✨ NEW COLLECTION 2026</span>

          <h1>
            Elegance <br />
            Redefined
          </h1>

          <p>
            Discover stunning dresses, chic blouses,
            tailored skirts, and timeless outerwear
            crafted for the modern woman.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="shop-btn">Shop Collection</Link>
            <Link to="/shop" className="explore-btn">Explore New Arrivals</Link>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200"
            alt="Women's Fashion"
          />
        </div>
      </section>

      {/* Featured Categories Grid */}
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
            <img src="https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500" alt="Tops & Blouses" />
            <div className="category-content">
              <h3>Tops & Blouses</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500" alt="Skirts" />
            <div className="category-content">
              <h3>Skirts</h3>
            </div>
          </Link>
          <Link to="/shop" className="category-tile">
            <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" alt="Outerwear" />
            <div className="category-content">
              <h3>Outerwear</h3>
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
