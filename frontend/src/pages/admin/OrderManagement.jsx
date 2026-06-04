import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/admin/OrderTable';
import { fetchAdminOrders, updateOrderStatus } from '../../services/api';
import { Loader2 } from 'lucide-react';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const loadOrders = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    // First try to fetch real backend orders
    const backendOrders = await fetchAdminOrders(token);
    
    if (backendOrders && backendOrders.data && backendOrders.data.orders) {
      // Map backend orders to frontend format
      const mappedOrders = backendOrders.data.orders.map(o => ({
        id: o._id,
        customer: o.shippingAddress?.fullName || o.shippingAddress?.name || o.user?.name || 'Customer',
        email: o.user?.email || 'N/A',
        amount: `₹${o.totalPrice?.toLocaleString('en-IN') || 0}`,
        status: o.orderStatus ? (o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1).toLowerCase()) : 'Pending',
        date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        _original: o // keep original for updates
      }));
      setOrders(mappedOrders);
    } else {
      // Fallback to local storage if backend is empty or failing
      try {
        const localOrders = JSON.parse(localStorage.getItem('urbanwear_placed_orders') || '[]');
        const normalizedLocal = localOrders.map(o => ({
          ...o,
          status: o.status ? (o.status === 'COD' ? 'Pending' : o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()) : 'Pending'
        }));
        setOrders(normalizedLocal);
      } catch (e) {
        setOrders([]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const res = await updateOrderStatus(orderId, newStatus.toLowerCase(), token);
    
    if (res && res.success !== false) {
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Order Management</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">View and manage customer orders</p>
      </div>

      <div className="flex space-x-1 mb-6 bg-admin-card dark:bg-admin-card-dark p-1 rounded-xl border border-admin-border dark:border-admin-border-dark w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-admin-bg dark:bg-[#222] text-admin-heading dark:text-admin-heading-dark shadow-sm' 
                : 'text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-admin-accent h-8 w-8" />
        </div>
      ) : (
        <OrderTable orders={orders} statusFilter={activeTab} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
};

export default OrderManagement;
