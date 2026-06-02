import React, { useState } from 'react';
import OrderTable from '../../components/admin/OrderTable';

const mockOrders = [
  { id: '#UW-1042', customer: 'Aarav Sharma', email: 'aarav@example.com', amount: '₹4,999', status: 'Delivered', date: 'May 28, 2026' },
  { id: '#UW-1041', customer: 'Priya Mehta', email: 'priya@example.com', amount: '₹3,499', status: 'Processing', date: 'May 28, 2026' },
  { id: '#UW-1040', customer: 'Rohan Verma', email: 'rohan@example.com', amount: '₹5,999', status: 'Shipped', date: 'May 27, 2026' },
  { id: '#UW-1039', customer: 'Sneha Kapoor', email: 'sneha@example.com', amount: '₹6,999', status: 'Pending', date: 'May 27, 2026' },
  { id: '#UW-1038', customer: 'Aditya Singh', email: 'aditya@example.com', amount: '₹3,999', status: 'Delivered', date: 'May 26, 2026' },
  { id: '#UW-1037', customer: 'Kavya Patel', email: 'kavya@example.com', amount: '₹2,499', status: 'Cancelled', date: 'May 25, 2026' },
];

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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

      <OrderTable orders={mockOrders} statusFilter={activeTab} />
    </div>
  );
};

export default OrderManagement;
