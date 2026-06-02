import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Grid3X3 } from 'lucide-react';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductCard from '../components/product/ProductCard';
import { fetchProducts } from '../services/api';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const initialCategory = searchParams.get('category');

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    minPrice: '',
    maxPrice: ''
  });

  const searchQuery = searchParams.get('q') || '';
  const isSearchPage = location.pathname === '/search';

  const [gridSize, setGridSize] = useState(3);
  const itemsPerPage = gridSize * 4;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.categories?.length > 0) {
          params.append('category', filters.categories.join(','));
        }
        if (filters.sizes?.length > 0) {
          params.append('size', filters.sizes.join(','));
        }
        if (filters.colors?.length > 0) {
          params.append('color', filters.colors.join(','));
        }
        if (filters.minPrice) {
          params.append('minPrice', filters.minPrice);
        }
        if (filters.maxPrice) {
          params.append('maxPrice', filters.maxPrice);
        }
        if (isSearchPage && searchQuery) {
          params.append('search', searchQuery);
        }

        if (sortType === 'price-low') {
          params.append('sort', 'price');
        } else if (sortType === 'price-high') {
          params.append('sort', '-price');
        } else if (sortType === 'latest') {
          params.append('sort', '-createdAt');
        }

        params.append('page', currentPage);
        params.append('limit', itemsPerPage);

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const data = await fetchProducts(queryStr);

        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalProducts(data.pagination?.total || 0);
      } catch (error) {
        // Suppress console error in production but keep it for devs
        // console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, sortType, searchQuery, currentPage, itemsPerPage, isSearchPage]);

  // Reset page on filter/search
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filters, sortType, searchQuery]);

  // Close mobile filter on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterOpen(false);
  }, [location]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalProducts);
  const currentItems = products;

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
              {totalProducts === 0
                ? 0
                : indexOfFirstItem + 1}
              {' - '}
              {Math.min(
                indexOfLastItem,
                totalProducts
              )}{' '}
              of {totalProducts}{' '}
              results
            </h4>
          </div>

          {/* Empty State */}
          {totalProducts === 0 ? (
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
