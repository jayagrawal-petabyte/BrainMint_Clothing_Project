import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Phone, User } from 'lucide-react';
import './BottomMobileNav.css';

const BottomMobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/shop', icon: <ShoppingBag size={22} />, label: 'Shop' },
    { path: '/contact', icon: <Phone size={22} />, label: 'Contact' },
    { path: '/account', icon: <User size={22} />, label: 'Profile' },
  ];

  return (
    <nav className="bottom-mobile-nav d-lg-none">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon">
              {item.icon}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomMobileNav;
