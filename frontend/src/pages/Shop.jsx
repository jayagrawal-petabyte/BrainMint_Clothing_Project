import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Shop.css';

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="shop-page">
      {/* Page Title / Breadcrumb Area */}
      <div className="shop-page-header">
        <h1 className="page-title">Shop</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span className="current">Shop</span>
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
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, mockProducts.length)} of {mockProducts.length} results
            </h4>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {currentItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={currentPage === 1} 
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="page-btn"
                disabled={currentPage === totalPages} 
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
