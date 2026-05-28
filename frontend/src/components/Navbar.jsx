import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Phone, Heart, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.q.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      e.target.reset();
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-middle">
        <div className="container">
          <div className="navbar-middle-content">
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
                  <input type="search" name="q" placeholder="Search our store" />
                  <button type="submit">
                    <Search size={20} />
                  </button>
                </form>
              </div>
            </div>

            <div className="header-options">
              <ul>
                <li className="user-menu">
                  <Link to="/account">
                    <User size={24} />
                  </Link>
                </li>
                <li className="user-menu">
                  <Link to="/wishlist" title="Wishlist">
                    <Heart size={24} />
                  </Link>
                </li>
                <li className="user-menu">
                  <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', color: 'var(--ltn__heading-color)', transition: 'all 0.3s ease' }}>
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                  </button>
                </li>
                <li className="mini-cart">
                  <button
                    className="mini-cart-btn"
                    onClick={() => setIsCartOpen(true)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
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
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  );
};

export default Navbar;

