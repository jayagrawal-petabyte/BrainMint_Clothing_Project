import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, User, Heart, ShoppingCart, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchTrendingSearches } from '../../services/api';
import './MobileMenuDrawer.css';

const MobileMenuDrawer = ({ isOpen, onClose }) => {
  const { isLoggedIn, logout, user } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [trendingKeywords, setTrendingKeywords] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadTrending = async () => {
      try {
        const searches = await fetchTrendingSearches();
        if (isMounted && searches) {
          setTrendingKeywords(searches.slice(0, 3));
        }
      } catch {
      }
    };
    loadTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.q.value.trim();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="mobile-menu-drawer"
          >
            <div className="mobile-menu-header">
              <div className="site-logo">
                <Link to="/" className="theme-logo" onClick={onClose}>
                  <img src="/src/assets/logo.png" alt="Princess Size Plus Collection" style={{ height: '40px', display: 'block' }} />
                </Link>
              </div>
              <button className="mobile-menu-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="mobile-menu-search">
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <input
                  type="search"
                  name="q"
                  placeholder="Search our store"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  autoComplete="off"
                />
                <button type="submit">
                  <Search size={20} />
                </button>

                <AnimatePresence>
                  {isFocused && trendingKeywords.length > 0 && (
                    <motion.div
                      className="search-suggestions-dropdown mobile-drawer-dropdown"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '50px',
                        left: 0,
                        width: '100%',
                        backgroundColor: 'var(--white-7)',
                        border: '1px solid var(--border-color-1)',
                        borderRadius: '12px',
                        zIndex: 1000,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                        padding: '12px 0'
                      }}
                    >
                      <div className="dropdown-header" style={{
                        fontFamily: 'var(--ltn__heading-font)',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--ltn__paragraph-color)',
                        padding: '0 20px',
                        marginBottom: '10px',
                        textAlign: 'left'
                      }}>Trending Searches</div>
                      <ul className="suggestions-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {trendingKeywords.map((item) => {
                          const keyword = typeof item === 'string' ? item : (item.label || item.value || '');
                          return (
                            <li key={keyword} style={{ width: '100%' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
                                  onClose();
                                  setIsFocused(false);
                                }}
                                className="suggestion-link"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '100%',
                                  padding: '10px 20px',
                                  background: 'transparent',
                                  border: 'none',
                                  textAlign: 'left',
                                  fontFamily: 'var(--ltn__body-font)',
                                  fontSize: '14px',
                                  color: 'var(--ltn__heading-color)',
                                  cursor: 'pointer'
                                }}
                              >
                                <span>{keyword}</span>
                                <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <div className="mobile-menu-content">
              <ul className="mobile-nav-list">
                <li className="mobile-nav-item">
                  <Link to="/" onClick={onClose}>HOME</Link>
                </li>
                <li className="mobile-nav-item">
                  <Link to="/about" onClick={onClose}>ABOUT US</Link>
                </li>
                <li className="mobile-nav-item">
                  <Link to="/shop" onClick={onClose}>SHOP</Link>
                </li>
                <li className="mobile-nav-item">
                  <Link to="/contact" onClick={onClose}>CONTACT</Link>
                </li>
              </ul>

              <div className="mobile-menu-bottom-links">
                <Link to="/account" onClick={onClose} className="mobile-bottom-link">
                  <User size={20} />
                  <span>My Account</span>
                </Link>
                <Link to="/wishlist" onClick={onClose} className="mobile-bottom-link">
                  <Heart size={20} />
                  <span>Wishlist</span>
                </Link>
                <Link to="/cart" onClick={onClose} className="mobile-bottom-link">
                  <ShoppingCart size={20} />
                  <span>Shopping Cart</span>
                  {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
                </Link>
                <button onClick={toggleTheme} className="mobile-bottom-link logout-btn">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                {isLoggedIn && (
                  <button onClick={() => { logout(); onClose(); }} className="mobile-bottom-link logout-btn">
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuDrawer;
