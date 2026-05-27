import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Shop.css';

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    minPrice: '',
    maxPrice: ''
  });

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get('q') || '';
  const isSearchPage = location.pathname === '/search';

  const itemsPerPage = 9;

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortType, searchQuery]);

  // Close filter drawer on route change
  useEffect(() => {
    setFilterOpen(false);
  }, [location]);

  // Search filtering (applied first)
  let products = mockProducts;
  if (isSearchPage && searchQuery) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sidebar filtering
  let filteredProducts = products.filter(product => {
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.some(cat => product.name.toLowerCase().includes(cat.toLowerCase()));
    
    const matchesSize = filters.sizes.length === 0 || 
      product.sizes.some(size => filters.sizes.includes(size));
      
    const matchesColor = filters.colors.length === 0 || 
      product.colors.some(color => filters.colors.includes(color));
      
    const matchesMinPrice = filters.minPrice === '' || product.price >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || product.price <= Number(filters.maxPrice);

    return matchesCategory && matchesSize && matchesColor && matchesMinPrice && matchesMaxPrice;
  });

  // Sorting Logic
  if (sortType === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'latest') {
    filteredProducts.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return Number(b.id) - Number(a.id);
    });
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="shop-page">
      {/* Page Title / Breadcrumb Area */}
      <div className="shop-page-header">
        <h1 className="page-title">
          {isSearchPage && searchQuery ? `Search: "${searchQuery}"` : 'Shop'}
        </h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;{' '}
          {isSearchPage ? (
            <span className="current">Search Results</span>
          ) : (
            <span className="current">Shop</span>
          )}
        </div>
      </div>

      {/* Main Shop Layout */}
      <div className="shop-container">
        {/* Left Sidebar (Desktop) */}
        <aside className="shop-sidebar">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                className="filter-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFilterOpen(false)}
              />
              <motion.div
                className="mobile-filter-drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className="drawer-header">
                  <h3>Filters</h3>
                  <button className="drawer-close-btn" onClick={() => setFilterOpen(false)}>
                    <X size={22} />
                  </button>
                </div>
                <div className="drawer-body">
                  <FilterSidebar filters={filters} onFilterChange={setFilters} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Right Content Area */}
        <main className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={18} />
              <span>Filter</span>
            </button>
            <div className="sort-dropdown">
              <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="default">Default sorting</option>
                <option value="latest">Sort by latest</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
              </select>
            </div>
            <h4 className="product-count">
              Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} results
            </h4>
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No products found{isSearchPage && searchQuery ? ` for "${searchQuery}"` : ''}. Try adjusting your filters.</p>
            </div>
          )}

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
