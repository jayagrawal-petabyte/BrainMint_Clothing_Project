import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Phone, Heart, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from "./CartDrawer";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchTrendingSearches } from '../../services/api';
import logoUrl from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const lastScrollYRef = useRef(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 150) {
        setIsNavbarHidden(true);
      } else {
        setIsNavbarHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.q.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false);
      e.target.reset();
    }
  };

  return (
    <>
      <header className={`navbar-container ${isNavbarHidden ? 'navbar-hidden' : ''}`}>
        <div className="navbar-middle">
          <div className="container">
            <div className="navbar-middle-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button className="mobile-menu-btn d-lg-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ marginRight: '8px', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
                    {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                  </button>
                  <div className="site-logo">
                    <Link to="/" className="theme-logo brand-logo-link">
                      <img src={logoUrl} alt="Princess Size+ Collection" className="brand-logo-img" />
                      <div className="brand-logo-text">
                        <span className="brand-logo-line1">Princess Size+</span>
                        <span className="brand-logo-line2">Collection</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="header-feature-item d-none-lg">
                  <div className="header-feature-icon">
                    <Phone size={24} />
                  </div>
                  <div className="header-feature-info">
                    <h6>PHONE</h6>
                    <p><a href="tel:+917200219272">+91 72002 19272</a></p>
                  </div>
                </div>
              </div>

              <div className="header-search d-none-lg">
                <form onSubmit={handleSearch}>
                  <input
                    type="search"
                    name="q"
                    placeholder="Search our store"
                    aria-label="Search store"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    autoComplete="off"
                  />
                  <button type="submit" aria-label="Submit search">
                    <Search size={20} />
                  </button>

                  <AnimatePresence>
                    {isFocused && trendingKeywords.length > 0 && (
                      <motion.div
                        className="search-suggestions-dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="dropdown-header">Trending Searches</div>
                        <ul className="suggestions-list">
                          {trendingKeywords.map((item) => {
                            const keyword = typeof item === 'string' ? item : (item.label || item.value || '');
                            return (
                              <li key={keyword} className="suggestion-item">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigate(`/search?q=${encodeURIComponent(keyword)}`);
                                    setIsFocused(false);
                                  }}
                                  className="suggestion-link"
                                >
                                  <span className="suggestion-text">{keyword}</span>
                                  <span className="suggestion-arrow">
                                    <ArrowUpRight size={14} />
                                  </span>
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

              <div className="header-options">
                <ul>
                  <li className="user-menu d-lg-none">
                    <button className="navbar-icon-btn" aria-label="Search" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
                      {isMobileSearchOpen ? <X size={24} /> : <Search size={24} />}
                    </button>
                  </li>
                  <li className="user-menu d-none-lg">
                    <div className="user-dropdown-container">
                      <button className={`theme-toggle-btn navbar-icon-btn ${isLoggedIn ? 'logged-in' : ''}`} aria-label="User Account Menu">
                        <User size={24} />
                      </button>
                      <div className="user-dropdown-menu">
                        {isLoggedIn ? (
                          <>
                            <div className="user-dropdown-header">
                              <Link to="/account" style={{ color: 'inherit', textDecoration: 'none' }}>
                                {user?.name || user?.email?.split('@')[0] || 'My Account'}
                              </Link>
                            </div>
                            <Link to="/admin" className="user-dropdown-menu-item">Admin Panel</Link>
                            <button className="user-dropdown-menu-item" onClick={logout}>
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link to="/login" className="user-dropdown-menu-item">Login</Link>
                            <Link to="/register" className="user-dropdown-menu-item">Register</Link>
                            <Link to="/account" className="user-dropdown-menu-item">My Account</Link>
                            <Link to="/admin/login" className="user-dropdown-menu-item">Admin Login</Link>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="user-menu">
                    <Link to="/wishlist" title="Wishlist" aria-label="Wishlist">
                      <Heart size={24} />
                    </Link>
                  </li>
                  <li className="user-menu">
                    <button
                      onClick={toggleTheme}
                      className="theme-toggle-btn navbar-icon-btn"
                      title="Toggle Theme"
                      aria-label="Toggle Theme"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '45px',
                        height: '45px',
                        color: 'var(--ltn__heading-color)',
                        overflow: 'hidden'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={theme}
                          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                          animate={{ rotate: 0, scale: 1, opacity: 1 }}
                          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                        </motion.div>
                      </AnimatePresence>
                    </button>
                  </li>
                  <li className="mini-cart">
                    <button
                      className="mini-cart-btn"
                      onClick={() => setIsCartOpen(true)}
                      aria-label="Open Cart Drawer"
                    >
                      <div className="mini-cart-icon">
                        <ShoppingCart size={24} />
                        <sup><span className="cart-badge">{cartCount}</span></sup>
                      </div>
                      <div className="mini-cart-info d-none-lg">
                        <h6>Your Cart</h6>
                        <span className="cart-total">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              className="mobile-search-bar-overlay d-lg-none"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: 'visible', borderBottom: '1px solid var(--border-color-1)', backgroundColor: 'var(--white-7)' }}
            >
              <div className="container" style={{ padding: '12px 20px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="search"
                    name="q"
                    placeholder="Search our store"
                    aria-label="Search store"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    autoComplete="off"
                    style={{
                      width: '100%',
                      height: '45px',
                      borderRadius: '30px',
                      border: '1px solid var(--border-color-1)',
                      padding: '0 45px 0 20px',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'var(--white-7)',
                      color: 'var(--ltn__heading-color)'
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    style={{
                      position: 'absolute',
                      right: '5px',
                      top: '2px',
                      height: '40px',
                      width: '40px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--ltn__primary-color)'
                    }}
                  >
                    <Search size={18} />
                  </button>

                  <AnimatePresence>
                    {isFocused && trendingKeywords.length > 0 && (
                      <motion.div
                        className="search-suggestions-dropdown"
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
                          padding: '16px 0'
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
                                    navigate(`/search?q=${encodeURIComponent(keyword)}`);
                                    setIsMobileSearchOpen(false);
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="navbar-bottom d-none-lg">
          <div className="container">
            <nav className="main-menu">
              <ul>
                <li>
                  <Link to="/">HOME</Link>
                </li>
                <li>
                  <Link to="/about">ABOUT US</Link>
                </li>
                <li>
                  <Link to="/shop">SHOP</Link>
                </li>
                <li>
                  <Link to="/contact">CONTACT</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

      </header>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;

