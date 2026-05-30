
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: About */}
            <div className="footer-widget">
              <h4 className="footer-title">About Us</h4>
              <p>We are an exclusive women's fashion destination, bringing you curated collections of dresses, tops, skirts, and outerwear. Elegance and style in every thread.</p>
              <div className="social-icons">
                <ul>
                  <li>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="Linkedin">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-widget">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="footer-widget">
              <h4 className="footer-title">Customer Care</h4>
              <ul className="footer-links">
                <li><Link to="/returns">Returns Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Order Tracking</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="footer-widget">
              <h4 className="footer-title">Newsletter</h4>
              <p>Subscribe to our newsletter to get updates on our latest offers!</p>
              <div className="newsletter-form">
                <form action="#" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Email address" required />
                  <button type="submit" aria-label="Subscribe">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="copyright-text">
              Â© {new Date().getFullYear()} UrbanWear. All Rights Reserved.
            </p>
            <div className="payment-methods">
              {/* Placeholders for payment icons */}
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
