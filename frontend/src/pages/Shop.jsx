import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Shop.css';

const Shop = () => {
  return (
    <div className="shop-page">
      {/* Page Title / Breadcrumb Area */}
      <div className="shop-page-header">
        <h1 className="page-title">Shop</h1>
        <div className="breadcrumb">
          <a href="/">Home</a> &gt; <span className="current">Shop</span>
        </div>
      </div>

      {/* Main Shop Layout */}
      <div className="shop-container">
        {/* Left Sidebar */}
        <aside className="shop-sidebar">
          <FilterSidebar />
        </aside>

        {/* Right Content Area */}
        <main className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="sort-dropdown">
              <select>
                <option>Default sorting</option>
                <option>Sort by popularity</option>
                <option>Sort by latest</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
              </select>
            </div>
            <h4 className="product-count">
              Showing 1 - {mockProducts.length} of {mockProducts.length} results
            </h4>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
