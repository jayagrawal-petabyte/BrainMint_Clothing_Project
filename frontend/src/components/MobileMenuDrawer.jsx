import { Link } from 'react-router-dom';
import { X, Search, ChevronDown, ChevronUp, User, Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './MobileMenuDrawer.css';

const MobileMenuDrawer = ({ isOpen, onClose }) => {
  const { isLoggedIn, logout, user } = useAuth();
  const { cartCount } = useCart();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

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
                  <span className="logo-text">UrbanWear<span className="logo-dot">.</span></span>
                </Link>
              </div>
              <button className="mobile-menu-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="mobile-menu-search">
              <form onSubmit={handleSearch}>
                <input type="search" name="q" placeholder="Search our store" />
                <button type="submit">
                  <Search size={20} />
                </button>
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
                <li className="mobile-nav-item has-dropdown">
                  <div className="mobile-nav-link-wrapper" onClick={() => toggleMenu('shop')}>
                    <span>SHOP</span>
                    {expandedMenus.shop ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  <AnimatePresence>
                    {expandedMenus.shop && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mobile-sub-menu"
                      >
                        <li><Link to="/shop?category=men" onClick={onClose}>Men</Link></li>
                        <li><Link to="/shop?category=women" onClick={onClose}>Women</Link></li>
                        <li><Link to="/shop?category=accessories" onClick={onClose}>Accessories</Link></li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
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
