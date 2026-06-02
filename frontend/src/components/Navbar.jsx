import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Phone, Heart, Sun, Moon, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from "react";
import CartDrawer from "./CartDrawer";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

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
      e.target.reset();
    }
  };

  return (
    <>
      <header className={`navbar-container ${isNavbarHidden ? 'navbar-hidden' : ''}`}>
        <div className="navbar-middle">
        <div className="container">
          <div className="navbar-middle-content">
            <button className="mobile-menu-btn d-lg-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ marginRight: '15px', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <div className="site-logo">
              <Link to="/" className="theme-logo">
                <span className="logo-text">UrbanWear<span className="logo-dot">.</span></span>
              </Link>
            </div>

            <div className="header-contact-search d-none-lg">
              <div className="header-feature-item">
                <div className="header-feature-icon">
                  <Phone size={24} />
                </div>
                <div className="header-feature-info">
                  <h6>PHONE</h6>
                  <p><a href="tel:123-456-789-10">123-456-789-10</a></p>
                </div>
              </div>

              <div className="header-search">
                <form onSubmit={handleSearch}>
                  <input type="search" name="q" placeholder="Search our store" aria-label="Search store" />
                  <button type="submit" aria-label="Submit search">
                    <Search size={20} />
                  </button>
                </form>
              </div>
            </div>

            <div className="header-options">
              <ul>
                <li className="user-menu">
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
                  <button onClick={toggleTheme} className="theme-toggle-btn navbar-icon-btn" title="Toggle Theme" aria-label="Toggle Theme">
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
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
                    <div className="mini-cart-info">
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
    </>
  );
};

export default Navbar;

