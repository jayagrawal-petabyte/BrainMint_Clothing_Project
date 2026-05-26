import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, Phone, Heart } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
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
                <form action="/search" method="get">
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
                      <sup><span className="cart-badge">0</span></sup>
                    </div>
                    <div className="mini-cart-info">
                      <h6>Your Cart</h6>
                      <span className="cart-total">$0.00</span>
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
              <li className="has-dropdown">
                <Link to="/">HOME <ChevronDown size={14} className="dropdown-icon" /></Link>
                <ul className="dropdown">
                  <li><Link to="/">Home Style - 01</Link></li>
                  <li><Link to="/">Home Style - 02</Link></li>
                  <li><Link to="/">Home Style - 03</Link></li>
                  <li><Link to="/">Home Style - 04</Link></li>
                </ul>
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
                    <h4>Men's Wear</h4>
                    <ul>
                      <li><Link to="/category/mens-tshirts">T-Shirts</Link></li>
                      <li><Link to="/category/mens-shirts">Shirts</Link></li>
                      <li><Link to="/category/mens-jeans">Jeans</Link></li>
                      <li><Link to="/category/mens-jackets">Jackets</Link></li>
                    </ul>
                  </div>
                  <div className="mega-menu-column">
                    <h4>Women's Wear</h4>
                    <ul>
                      <li><Link to="/category/womens-dresses">Dresses</Link></li>
                      <li><Link to="/category/womens-tops">Tops</Link></li>
                      <li><Link to="/category/womens-skirts">Skirts</Link></li>
                      <li><Link to="/category/womens-outerwear">Outerwear</Link></li>
                    </ul>
                  </div>
                  <div className="mega-menu-column">
                    <h4>Accessories</h4>
                    <ul>
                      <li><Link to="/category/bags">Bags</Link></li>
                      <li><Link to="/category/belts">Belts</Link></li>
                      <li><Link to="/category/hats">Hats</Link></li>
                      <li><Link to="/category/sunglasses">Sunglasses</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="has-dropdown">
                <Link to="/product/all">PRODUCT <ChevronDown size={14} className="dropdown-icon" /></Link>
                <ul className="dropdown">
                  <li><Link to="/collections">All Collections</Link></li>
                  <li><Link to="/product-media">Product Media</Link></li>
                  <li><Link to="/product-variants">Product Variants</Link></li>
                  <li><Link to="/product-countdown">Product Countdown</Link></li>
                </ul>
              </li>
              <li>
                <Link to="/news">NEWS</Link>
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
