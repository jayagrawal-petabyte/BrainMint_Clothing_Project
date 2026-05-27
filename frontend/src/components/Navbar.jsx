import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, Phone, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

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
                  <ul className="dropdown">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/wishlist">Wishlist</Link></li>
                    <li><Link to="/account">My Account</Link></li>
                  </ul>
                </li>
                <li className="user-menu">
                  <Link to="/wishlist" title="Wishlist">
                    <Heart size={24} />
                  </Link>
                </li>
                <li className="mini-cart">
                  <Link to="/cart" className="mini-cart-btn">
                    <div className="mini-cart-icon">
                      <ShoppingCart size={24} />
                      <sup><span className="cart-badge">{cartCount}</span></sup>
                    </div>
                    <div className="mini-cart-info">
                      <h6>Your Cart</h6>
                      <span className="cart-total">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </Link>
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
              <li className="has-dropdown">
                <Link to="/about">ABOUT US <ChevronDown size={14} className="dropdown-icon" /></Link>
                <ul className="dropdown">
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/service">Service</Link></li>
                  <li><Link to="/faq">Faq</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </li>
              <li className="has-mega-menu">
                <Link to="/shop">SHOP <ChevronDown size={14} className="dropdown-icon" /></Link>
                <div className="mega-menu">

                  <div className="mega-menu-column">
                    <h4>Dresses</h4>
                    <ul>
                      <li><Link to="/shop">Maxi Dresses</Link></li>
                      <li><Link to="/shop">Wrap Dresses</Link></li>
                      <li><Link to="/shop">Evening Dresses</Link></li>
                    </ul>
                  </div>

                  <div className="mega-menu-column">
                    <h4>Tops & Blouses</h4>
                    <ul>
                      <li><Link to="/shop">Blouses</Link></li>
                      <li><Link to="/shop">Crop Tops</Link></li>
                      <li><Link to="/shop">Off-Shoulder Tops</Link></li>
                    </ul>
                  </div>

                  <div className="mega-menu-column">
                    <h4>Bottoms & Outerwear</h4>
                    <ul>
                      <li><Link to="/shop">Skirts</Link></li>
                      <li><Link to="/shop">Trousers & Pants</Link></li>
                      <li><Link to="/shop">Coats & Blazers</Link></li>
                    </ul>
                  </div>

                </div>
              </li>
              <li>
                <Link to="/contact">CONTACT</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
