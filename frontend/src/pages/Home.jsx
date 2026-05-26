import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-placeholder">
      <h1>Welcome to Clothing Store</h1>
      <p>This is the homepage placeholder.</p>
      <Link to="/shop">Go to Shop</Link>
    </div>
  );
};

export default Home;
