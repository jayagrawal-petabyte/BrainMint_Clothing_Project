import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Sun, Moon, User, Menu, ShoppingBag, MessageSquare, CheckCheck } from 'lucide-react';
import { fetchAdminOrders, fetchContactMessages } from '../../services/api';
import { Link } from 'react-router-dom';

const STORAGE_KEY_ORDERS   = 'admin_read_order_ids';
const STORAGE_KEY_MESSAGES = 'admin_read_msg_ids';

const getReadIds = (key) => {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch { return new Set(); }
};

const saveReadIds = (key, set) => {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch {}
};

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return 'Just now';
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
};

const AdminTopbar = ({ toggleSidebar }) => {
  const [isDark, setIsDark]           = useState(false);
  const [allOrders, setAllOrders]     = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [readOrderIds, setReadOrderIds]     = useState(() => getReadIds(STORAGE_KEY_ORDERS));
  const [readMsgIds,   setReadMsgIds]       = useState(() => getReadIds(STORAGE_KEY_MESSAGES));
  const [isOpen, setIsOpen]           = useState(false);
  const [activeTab, setActiveTab]     = useState('all'); // 'all' | 'orders' | 'messages'
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) return;

    // Fetch all orders — show recent 20
    const orderRes = await fetchAdminOrders(token).catch(() => null);
    if (orderRes?.data?.orders) {
      const sorted = [...orderRes.data.orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllOrders(sorted.slice(0, 20));
    } else if (orderRes?.data && Array.isArray(orderRes.data)) {
      const sorted = [...orderRes.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllOrders(sorted.slice(0, 20));
    }

    // Fetch all contact messages — show recent 20
    const msgRes = await fetchContactMessages(token).catch(() => null);
    if (msgRes && msgRes.success !== false) {
      const msgs = msgRes.data?.contacts || msgRes.contacts || msgRes.data || [];
      if (Array.isArray(msgs)) {
        const sorted = [...msgs].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setAllMessages(sorted.slice(0, 20));
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

  // Unread = items whose ID is not in the read set
  const unreadOrders   = allOrders.filter(o => !readOrderIds.has(o._id));
  const unreadMessages = allMessages.filter(m => !readMsgIds.has(m._id || String(m.createdAt)));
  const totalUnread    = unreadOrders.length + unreadMessages.length;

  const markAllRead = () => {
    const newOrderIds = new Set([...readOrderIds, ...allOrders.map(o => o._id)]);
    const newMsgIds   = new Set([...readMsgIds,   ...allMessages.map(m => m._id || String(m.createdAt))]);
    setReadOrderIds(newOrderIds);
    setReadMsgIds(newMsgIds);
    saveReadIds(STORAGE_KEY_ORDERS,   newOrderIds);
    saveReadIds(STORAGE_KEY_MESSAGES, newMsgIds);
  };

  const markOrderRead = (id) => {
    const next = new Set([...readOrderIds, id]);
    setReadOrderIds(next);
    saveReadIds(STORAGE_KEY_ORDERS, next);
  };

  const markMsgRead = (id) => {
    const next = new Set([...readMsgIds, id]);
    setReadMsgIds(next);
    saveReadIds(STORAGE_KEY_MESSAGES, next);
  };

  // Items to show depends on active tab
  const visibleOrders   = activeTab === 'messages' ? [] : allOrders;
  const visibleMessages = activeTab === 'orders'   ? [] : allMessages;

  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered')  return 'text-emerald-500';
    if (s === 'shipped')    return 'text-purple-500';
    if (s === 'confirmed')  return 'text-blue-500';
    if (s === 'cancelled')  return 'text-red-500';
    return 'text-orange-500';
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
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none outline-none text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* ── Notification Bell ── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none outline-none relative text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#222] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-admin-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card dark:border-admin-card-dark">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </button>

          {/* ── Notification Dropdown ── */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-admin-card dark:bg-admin-card-dark border border-admin-border dark:border-admin-border-dark rounded-xl shadow-2xl overflow-hidden font-rubik z-50">

              {/* Header */}
              <div className="p-4 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/40 dark:bg-[#1A1A1A]/40">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-admin-heading dark:text-admin-heading-dark">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {totalUnread > 0 && (
                      <span className="text-xs bg-admin-accent text-white px-2 py-0.5 rounded-full font-medium">
                        {totalUnread} unread
                      </span>
                    )}
                    {totalUnread > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs text-admin-text dark:text-admin-text-dark hover:text-admin-accent transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={14} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Pills */}
                <div className="flex gap-1">
                  {[
                    { id: 'all',      label: 'All',      count: totalUnread },
                    { id: 'orders',   label: 'Orders',   count: unreadOrders.length },
                    { id: 'messages', label: 'Messages', count: unreadMessages.length },
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
                        <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-admin-accent/15 text-admin-accent'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed */}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-admin-border dark:divide-admin-border-dark">
                {visibleOrders.length === 0 && visibleMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={28} className="mx-auto mb-2 text-admin-text/30 dark:text-admin-text-dark/30" />
                    <p className="text-sm text-admin-text dark:text-admin-text-dark">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {/* Orders */}
                    {visibleOrders.length > 0 && (
                      <>
                        {activeTab === 'all' && (
                          <div className="px-4 py-2 flex items-center gap-2 bg-admin-bg/30 dark:bg-[#111]/30">
                            <ShoppingBag size={13} className="text-admin-accent" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-admin-text dark:text-admin-text-dark">
                              Orders ({allOrders.length})
                            </span>
                          </div>
                        )}
                        {visibleOrders.map(order => {
                          const isUnread = !readOrderIds.has(order._id);
                          return (
                            <Link
                              key={order._id}
                              to="/admin/orders"
                              onClick={() => {
                                markOrderRead(order._id);
                                setIsOpen(false);
                              }}
                              className={`flex gap-3 p-4 hover:bg-admin-bg/50 dark:hover:bg-[#1A1A1A]/60 transition-colors relative ${
                                isUnread ? 'bg-admin-accent/5 dark:bg-admin-accent/8' : ''
                              }`}
                            >
                              {isUnread && (
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-admin-accent flex-shrink-0" />
                              )}
                              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40 flex items-center justify-center flex-shrink-0">
                                <ShoppingBag size={16} className="text-orange-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm ${isUnread ? 'font-semibold text-admin-heading dark:text-admin-heading-dark' : 'font-medium text-admin-text dark:text-admin-text-dark'}`}>
                                    New Order — ₹{order.totalPrice?.toLocaleString('en-IN') || 0}
                                  </p>
                                  <span className={`text-[10px] ml-2 flex-shrink-0 font-medium ${statusColor(order.orderStatus || order.status)}`}>
                                    {order.orderStatus || order.status || 'Pending'}
                                  </span>
                                </div>
                                <p className="text-xs text-admin-text dark:text-admin-text-dark truncate mt-0.5">
                                  {order.shippingAddress?.fullName || order.shippingAddress?.name || 'Customer'} placed an order
                                </p>
                                <span className="text-[10px] text-admin-text/60 dark:text-admin-text-dark/60 mt-1 block">
                                  {timeAgo(order.createdAt)}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </>
                    )}

                    {/* Messages */}
                    {visibleMessages.length > 0 && (
                      <>
                        {activeTab === 'all' && (
                          <div className="px-4 py-2 flex items-center gap-2 bg-admin-bg/30 dark:bg-[#111]/30">
                            <MessageSquare size={13} className="text-blue-500" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-admin-text dark:text-admin-text-dark">
                              Messages ({allMessages.length})
                            </span>
                          </div>
                        )}
                        {visibleMessages.map((msg, i) => {
                          const msgId  = msg._id || String(msg.createdAt) || String(i);
                          const isUnread = !readMsgIds.has(msgId);
                          return (
                            <Link
                              key={msgId}
                              to="/admin/messages"
                              onClick={() => {
                                markMsgRead(msgId);
                                setIsOpen(false);
                              }}
                              className={`flex gap-3 p-4 hover:bg-admin-bg/50 dark:hover:bg-[#1A1A1A]/60 transition-colors relative ${
                                isUnread ? 'bg-blue-500/5 dark:bg-blue-500/8' : ''
                              }`}
                            >
                              {isUnread && (
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center flex-shrink-0">
                                <MessageSquare size={16} className="text-blue-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm ${isUnread ? 'font-semibold text-admin-heading dark:text-admin-heading-dark' : 'font-medium text-admin-text dark:text-admin-text-dark'}`}>
                                    {msg.name || 'Anonymous'}
                                  </p>
                                  <span className="text-[10px] ml-2 flex-shrink-0 text-blue-500 font-medium">Message</span>
                                </div>
                                <p className="text-xs text-admin-text dark:text-admin-text-dark truncate mt-0.5">
                                  {msg.subject || msg.message?.slice(0, 55) || 'No subject'}
                                </p>
                                <span className="text-[10px] text-admin-text/60 dark:text-admin-text-dark/60 mt-1 block">
                                  {timeAgo(msg.createdAt)}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
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
