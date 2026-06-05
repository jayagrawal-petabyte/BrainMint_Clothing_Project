import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sun, Moon, User, Menu } from 'lucide-react';
import { fetchAdminOrders } from '../../services/api';
import { Link } from 'react-router-dom';

const AdminTopbar = ({ toggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check initial theme
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');

    // Fetch pending orders for notifications
    const loadPendingOrders = async () => {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (token) {
        const response = await fetchAdminOrders(token);
        if (response && response.data && response.data.orders) {
          const pending = response.data.orders.filter(
            order => order.orderStatus && order.orderStatus.toLowerCase() === 'pending'
          );
          setPendingOrders(pending);
        }
      }
    };
    loadPendingOrders();
    
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <header className="h-20 bg-admin-card dark:bg-admin-card-dark border-b border-admin-border dark:border-admin-border-dark flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
      
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-admin-text dark:text-admin-text-dark" />
          </div>
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-admin-bg dark:bg-[#222] border border-transparent focus:border-admin-border dark:focus:border-[#444] rounded-lg outline-none text-admin-heading dark:text-admin-heading-dark placeholder-admin-text dark:placeholder-admin-text-dark transition-all duration-200 font-rubik"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="bg-transparent border-none outline-none text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="bg-transparent border-none outline-none relative text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark transition-colors"
          >
            <Bell size={22} />
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-admin-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card dark:border-admin-card-dark">
                {pendingOrders.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-admin-card dark:bg-admin-card-dark border border-admin-border dark:border-admin-border-dark rounded-xl shadow-lg overflow-hidden font-rubik z-50">
              <div className="p-4 border-b border-admin-border dark:border-admin-border-dark flex justify-between items-center bg-admin-bg/30 dark:bg-[#1A1A1A]/30">
                <h3 className="font-semibold text-admin-heading dark:text-admin-heading-dark">Notifications</h3>
                <span className="text-xs bg-admin-accent text-white px-2 py-0.5 rounded-full">{pendingOrders.length} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {pendingOrders.length === 0 ? (
                  <div className="p-6 text-center text-admin-text dark:text-admin-text-dark text-sm">
                    No new pending orders
                  </div>
                ) : (
                  pendingOrders.map(order => (
                    <Link 
                      key={order._id} 
                      to="/admin/orders" 
                      onClick={() => setIsNotificationOpen(false)}
                      className="block p-4 border-b border-admin-border dark:border-admin-border-dark hover:bg-admin-bg/50 dark:hover:bg-[#1A1A1A]/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-admin-heading dark:text-admin-heading-dark">New Order Received</span>
                        <span className="text-xs text-admin-accent font-medium">₹{order.totalPrice?.toLocaleString('en-IN') || 0}</span>
                      </div>
                      <p className="text-xs text-admin-text dark:text-admin-text-dark">
                        {order.shippingAddress?.fullName || 'Customer'} placed a new order.
                      </p>
                      <span className="text-[10px] text-admin-text/70 dark:text-admin-text-dark/70 mt-2 block">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              {pendingOrders.length > 0 && (
                <Link 
                  to="/admin/orders" 
                  onClick={() => setIsNotificationOpen(false)}
                  className="block w-full p-3 text-center text-sm text-admin-accent hover:bg-admin-bg/30 dark:hover:bg-[#1A1A1A]/30 font-medium transition-colors border-t border-admin-border dark:border-admin-border-dark"
                >
                  View all orders
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-admin-border dark:bg-admin-border-dark"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-admin-border-dark flex items-center justify-center text-admin-heading dark:text-admin-heading-dark group-hover:border-admin-accent transition-colors flex-shrink-0">
            <User size={20} />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark font-montserrat mb-0.5">Admin User</span>
            <span className="text-xs text-admin-text dark:text-admin-text-dark font-rubik">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
