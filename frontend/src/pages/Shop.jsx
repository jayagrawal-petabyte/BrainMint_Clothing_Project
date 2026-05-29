import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Grid3X3 } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: ''
  });

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const searchQuery = searchParams.get('q') || '';
  const isSearchPage = location.pathname === '/search';

  const [gridSize, setGridSize] = useState(3);
  const itemsPerPage = gridSize * 4;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();

        console.log('Fetched Products:', data);

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Reset page on filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortType, searchQuery]);

  // Close mobile filter on route change
  useEffect(() => {
    setFilterOpen(false);
  }, [location]);

  // Search
  let searchedProducts = [...products];

  if (isSearchPage && searchQuery) {
    searchedProducts = searchedProducts.filter(product =>
      product.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }

  // Filter
  let filteredProducts = searchedProducts.filter(product => {
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category?.name);

    const matchesMinPrice =
      filters.minPrice === '' ||
      product.price >= Number(filters.minPrice);

    const matchesMaxPrice =
      filters.maxPrice === '' ||
      product.price <= Number(filters.maxPrice);

    return (
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  // Sorting
  if (sortType === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'latest') {
    filteredProducts.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }

  // Pagination
  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentItems =
    filteredProducts.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px'
        }}
      >
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-page-header">
        <h1 className="page-title">
          {isSearchPage && searchQuery
            ? `Search: "${searchQuery}"`
            : 'Shop'}
        </h1>

        <div className="breadcrumb">
          <Link to="/">Home</Link>
          {' > '}
          {isSearchPage ? (
            <span className="current">
              Search Results
            </span>
          ) : (
            <span className="current">
              Shop
            </span>
          )}
        </div>
      </div>

      <div className="shop-container">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            products={products}
          />
        </aside>

        {/* Mobile Filters */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                className="filter-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() =>
                  setFilterOpen(false)
                }
              />

              <motion.div
                className="mobile-filter-drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.3
                }}
              >
                <div className="drawer-header">
                  <h3>Filters</h3>

                  <button
                    className="drawer-close-btn"
                    onClick={() =>
                      setFilterOpen(false)
                    }
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="drawer-body">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    products={products}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <button
              className="filter-toggle-btn"
              onClick={() =>
                setFilterOpen(true)
              }
            >
              <SlidersHorizontal size={18} />
              <span>Filter</span>
            </button>

            <div className="grid-size-slider">
              <span className="grid-icon">
                <Grid3X3 size={20} />
              </span>
              <input
                type="range"
                className="grid-range"
                min="2"
                max="4"
                step="1"
                value={gridSize}
                onChange={e =>
                  setGridSize(
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="sort-dropdown">
              <select
                value={sortType}
                onChange={e =>
                  setSortType(e.target.value)
                }
              >
                <option value="default">
                  SORT
                </option>

                <option value="latest">
                  Latest
                </option>

                <option value="price-low">
                  Price: Low → High
                </option>

                <option value="price-high">
                  Price: High → Low
                </option>
              </select>
            </div>

            <h4 className="product-count">
              Showing{' '}
              {filteredProducts.length === 0
                ? 0
                : indexOfFirstItem + 1}
              {' - '}
              {Math.min(
                indexOfLastItem,
                filteredProducts.length
              )}{' '}
              of {filteredProducts.length}{' '}
              results
            </h4>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No Products Found</h3>
              <p>
                Backend returned no
                products yet.
              </p>
            </div>
          ) : (
            <div
              className={`product-grid grid-cols-${gridSize}`}
            >
              {currentItems.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >
                &lt;
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map(page => (
                <button
                  key={page}
                  className={`page-btn ${
                    currentPage === page
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
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