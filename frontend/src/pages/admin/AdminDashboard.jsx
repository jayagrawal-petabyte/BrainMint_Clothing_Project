import React from 'react';
import DashboardCards from '../../components/admin/DashboardCards';
import SalesCharts from '../../components/admin/SalesCharts';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const recentOrders = [
  { id: '#UW-1042', customer: 'Aarav Sharma', product: 'Floral Maxi Dress', amount: '₹4,999', status: 'Delivered', date: 'May 28' },
  { id: '#UW-1041', customer: 'Priya Mehta', product: 'Silk Blouse', amount: '₹3,499', status: 'Processing', date: 'May 28' },
  { id: '#UW-1040', customer: 'Rohan Verma', product: 'Little Black Dress', amount: '₹5,999', status: 'Shipped', date: 'May 27' },
  { id: '#UW-1039', customer: 'Sneha Kapoor', product: 'Tailored Blazer', amount: '₹6,999', status: 'Pending', date: 'May 27' },
];

const AdminDashboard = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Dashboard Overview</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <DashboardCards />
      <SalesCharts />

      {/* Recent Orders Section */}
      <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden">
        <div className="p-6 border-b border-admin-border dark:border-admin-border-dark flex justify-between items-center">
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm font-medium text-admin-accent hover:text-red-600 flex items-center transition-colors">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-rubik">
            <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{order.id}</td>
                  <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{order.customer}</td>
                  <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{order.product}</td>
                  <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                      ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : ''}
                      ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
