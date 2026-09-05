import React, { useState, useEffect } from 'react';
import OrderTable from '../../components/admin/OrderTable';
import { fetchAdminOrders, updateOrderStatus, adminBulkDeleteOrders } from '../../services/api';
import { Loader2 } from 'lucide-react';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const tabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const loadOrders = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    
    // First try to fetch real backend orders
    const backendOrders = await fetchAdminOrders(token);
    
    if (backendOrders && backendOrders.data && Array.isArray(backendOrders.data)) {
      // Map backend orders to frontend format
      const mappedOrders = backendOrders.data.map(o => {
        let displayStatus = o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()) : 'Pending';
        if (o.paymentMethod === 'Razorpay' && o.paymentStatus === 'unpaid' && o.status === 'pending') {
          displayStatus = 'Cancelled';
        }
        
        return {
          id: o._id,
          customer: o.shippingAddress?.fullName || o.shippingAddress?.name || o.user?.name || 'Customer',
          email: o.user?.email || 'N/A',
          amount: `₹${o.totalPrice?.toLocaleString('en-IN') || 0}`,
          status: displayStatus,
          date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          _original: { ...o, discountAmount: o.discountAmount || 0, couponCode: o.couponCode || '' }
        };
      });
      setOrders(mappedOrders);
    } else {
      setOrders([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('adminToken');
    const res = await updateOrderStatus(orderId, newStatus.toLowerCase(), token);
    
    if (res && res.success !== false) {
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status. Please try again.");
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedOrderIds.length} orders? This cannot be undone.`)) return;

    setIsDeleting(true);
    const token = localStorage.getItem('adminToken');
    
    const res = await adminBulkDeleteOrders(selectedOrderIds, token);
    if (res && res.success) {
      setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
      setSelectedOrderIds([]);
      setIsBulkDeleteMode(false);
    } else {
      alert(res?.message || 'Failed to delete orders');
    }
    setIsDeleting(false);
  };

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Order Management</h1>
          <p className="text-admin-text dark:text-admin-text-dark mt-1">View and manage customer orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isBulkDeleteMode && (
            <button 
              onClick={handleBulkDelete}
              disabled={isDeleting || selectedOrderIds.length === 0}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
              Delete Selected ({selectedOrderIds.length})
            </button>
          )}
          <button 
            onClick={() => {
              setIsBulkDeleteMode(!isBulkDeleteMode);
              setSelectedOrderIds([]); // Clear selection when toggling
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
              isBulkDeleteMode 
                ? 'bg-admin-bg dark:bg-[#222] border-admin-border dark:border-admin-border-dark text-admin-heading dark:text-admin-heading-dark' 
                : 'bg-transparent border-admin-border dark:border-admin-border-dark text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222]'
            }`}
          >
            {isBulkDeleteMode ? 'Cancel Selection' : 'Enable Bulk Delete'}
          </button>
        </div>
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
        <OrderTable 
          orders={orders} 
          statusFilter={activeTab} 
          onUpdateStatus={handleUpdateStatus} 
          isBulkDeleteMode={isBulkDeleteMode}
          selectedOrderIds={selectedOrderIds}
          toggleOrderSelection={toggleOrderSelection}
        />
      )}
    </div>
  );
};

export default OrderManagement;
