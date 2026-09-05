import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Sun, Moon, User, Menu, ShoppingBag, MessageSquare } from 'lucide-react';
import { fetchAdminOrders, fetchContactMessages } from '../../services/api';
import { Link } from 'react-router-dom';

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const AdminTopbar = ({ toggleSidebar }) => {
  const [isDark,       setIsDark]       = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [messages,      setMessages]     = useState([]);
  const [isOpen,        setIsOpen]       = useState(false);
  const [activeTab,     setActiveTab]    = useState('all');
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) return;

    // Orders — only pending, latest 10
    const orderRes = await fetchAdminOrders(token).catch(() => null);
    const orders = orderRes?.data?.orders || (Array.isArray(orderRes?.data) ? orderRes.data : []);
    const pending = orders
      .filter(o => (o.orderStatus || o.status || '').toLowerCase() === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    setPendingOrders(pending);

    // Messages — latest 10
    const msgRes = await fetchContactMessages(token).catch(() => null);
    if (msgRes && msgRes.success !== false) {
      const msgs = msgRes.data?.contacts || msgRes.contacts || msgRes.data || [];
      if (Array.isArray(msgs)) {
        const sorted = [...msgs]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 10);
        setMessages(sorted);
      }
    }
  }, []);

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
    loadNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loadNotifications]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  const totalCount = pendingOrders.length + messages.length;

  const visibleOrders   = activeTab === 'messages' ? [] : pendingOrders;
  const visibleMessages = activeTab === 'orders'   ? [] : messages;

  return (
    <header className="h-20 bg-admin-card dark:bg-admin-card-dark border-b border-admin-border dark:border-admin-border-dark flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">

      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
        >
          <Menu size={24} />
        </button>

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

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none outline-none text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none outline-none relative text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-admin-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card dark:border-admin-card-dark">
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-admin-card dark:bg-admin-card-dark border border-admin-border dark:border-admin-border-dark rounded-xl shadow-2xl overflow-hidden font-rubik z-50">

              {/* Header + Tabs */}
              <div className="p-4 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/40 dark:bg-[#1A1A1A]/40">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-admin-heading dark:text-admin-heading-dark">Notifications</h3>
                  {totalCount > 0 && (
                    <span className="text-xs bg-admin-accent text-white px-2 py-0.5 rounded-full font-medium">
                      {totalCount} new
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {[
                    { id: 'all',      label: 'All',      count: totalCount },
                    { id: 'orders',   label: 'Orders',   count: pendingOrders.length },
                    { id: 'messages', label: 'Messages', count: messages.length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-admin-accent text-white'
                          : 'text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222]'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          activeTab === tab.id
                            ? 'bg-white/25 text-white'
                            : 'bg-admin-accent/15 text-admin-accent'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed */}
              <div className="max-h-[400px] overflow-y-auto">
                {visibleOrders.length === 0 && visibleMessages.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={26} className="mx-auto mb-2 text-admin-text/25 dark:text-admin-text-dark/25" />
                    <p className="text-sm text-admin-text dark:text-admin-text-dark">No notifications</p>
                  </div>
                ) : (
                  <>
                    {/* Pending Orders */}
                    {visibleOrders.length > 0 && (
                      <>
                        {activeTab === 'all' && (
                          <div className="px-4 py-2 flex items-center gap-2 bg-admin-bg/20 dark:bg-[#111]/20 border-b border-admin-border/50 dark:border-admin-border-dark/50">
                            <ShoppingBag size={12} className="text-orange-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-admin-text dark:text-admin-text-dark">
                              Pending Orders
                            </span>
                          </div>
                        )}
                        {visibleOrders.map(order => (
                          <Link
                            key={order._id}
                            to="/admin/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex gap-3 p-4 border-b border-admin-border/60 dark:border-admin-border-dark/60 hover:bg-admin-bg/50 dark:hover:bg-[#1A1A1A]/60 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag size={15} className="text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark truncate">
                                  ₹{order.totalPrice?.toLocaleString('en-IN') || 0}
                                </p>
                                <span className="text-[10px] text-orange-500 font-medium flex-shrink-0 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-full">
                                  Pending
                                </span>
                              </div>
                              <p className="text-xs text-admin-text dark:text-admin-text-dark truncate mt-0.5">
                                {order.shippingAddress?.fullName || order.shippingAddress?.name || 'Customer'} placed an order
                              </p>
                              <span className="text-[10px] text-admin-text/50 dark:text-admin-text-dark/50 mt-1 block">
                                {timeAgo(order.createdAt)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Messages */}
                    {visibleMessages.length > 0 && (
                      <>
                        {activeTab === 'all' && (
                          <div className="px-4 py-2 flex items-center gap-2 bg-admin-bg/20 dark:bg-[#111]/20 border-b border-admin-border/50 dark:border-admin-border-dark/50">
                            <MessageSquare size={12} className="text-blue-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-admin-text dark:text-admin-text-dark">
                              Recent Messages
                            </span>
                          </div>
                        )}
                        {visibleMessages.map((msg, i) => (
                          <Link
                            key={msg._id || i}
                            to="/admin/messages"
                            onClick={() => setIsOpen(false)}
                            className="flex gap-3 p-4 border-b border-admin-border/60 dark:border-admin-border-dark/60 hover:bg-admin-bg/50 dark:hover:bg-[#1A1A1A]/60 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center flex-shrink-0">
                              <MessageSquare size={15} className="text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark truncate">
                                  {msg.name || 'Anonymous'}
                                </p>
                                <span className="text-[10px] text-blue-500 font-medium flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-full">
                                  Message
                                </span>
                              </div>
                              <p className="text-xs text-admin-text dark:text-admin-text-dark truncate mt-0.5">
                                {msg.subject || msg.message?.slice(0, 60) || '—'}
                              </p>
                              <span className="text-[10px] text-admin-text/50 dark:text-admin-text-dark/50 mt-1 block">
                                {timeAgo(msg.createdAt)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="grid grid-cols-2 border-t border-admin-border dark:border-admin-border-dark">
                <Link
                  to="/admin/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-3 text-sm text-admin-accent hover:bg-admin-bg/30 dark:hover:bg-[#1A1A1A]/30 font-medium transition-colors border-r border-admin-border dark:border-admin-border-dark"
                >
                  <ShoppingBag size={14} />
                  All Orders
                </Link>
                <Link
                  to="/admin/messages"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-3 text-sm text-admin-accent hover:bg-admin-bg/30 dark:hover:bg-[#1A1A1A]/30 font-medium transition-colors"
                >
                  <MessageSquare size={14} />
                  All Messages
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-admin-border dark:bg-admin-border-dark" />

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-admin-border-dark flex items-center justify-center text-admin-heading dark:text-admin-heading-dark group-hover:border-admin-accent transition-colors flex-shrink-0">
            <User size={20} />
          </div>
          <div className="hidden sm:flex flex-col justify-center leading-tight">
            <span className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark font-montserrat mb-0.5">Admin User</span>
            <span className="text-xs text-admin-text dark:text-admin-text-dark font-rubik">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
