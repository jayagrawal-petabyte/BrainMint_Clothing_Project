import React from 'react';
import './Home.css';

const Home = () => {
  return (
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
          <button className="shop-btn">Shop Collection</button>
          <button className="explore-btn">Explore Trends</button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234"
          alt="Fashion Model"
        />
      </div>

    </section>
  );
};

export default Home;
