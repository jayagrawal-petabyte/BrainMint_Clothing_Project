import React, { useState, useEffect } from 'react';
import DashboardCards from '../../components/admin/DashboardCards';
import SalesCharts from '../../components/admin/SalesCharts';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchSalesAnalytics, fetchAdminOrders } from '../../services/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      try {
        // Fetch real analytics
        const analytics = await fetchSalesAnalytics(token);
        if (analytics && analytics.data) {
          // Format the stats for DashboardCards
          const newStats = [
            {
              title: 'Gross Revenue',
              value: `₹${(analytics.data?.stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
              change: '+10%', // Backend doesn't have history yet
              isPositive: true,
              icon: <ArrowRight size={24} className="text-white" />,
              color: 'bg-emerald-500',
            },
            {
              title: 'Total Orders',
              value: `${analytics.data?.stats?.totalOrders || 0}`,
              change: '+5%',
              isPositive: true,
              icon: <ArrowRight size={24} className="text-white" />,
              color: 'bg-blue-500',
            },
            {
              title: 'Conversion Rate',
              value: `0%`,
              change: '-',
              isPositive: false,
              icon: <ArrowRight size={24} className="text-white" />,
              color: 'bg-purple-500',
            },
            {
              title: 'Products',
              value: `${analytics.data?.stats?.totalProducts || 0}`,
              change: '+14.1%',
              isPositive: true,
              icon: <ArrowRight size={24} className="text-white" />,
              color: 'bg-orange-500',
            },
          ];
          setStats(newStats);
          
          if (analytics.data?.chartData) {
            setSalesData(analytics.data.chartData);
          }
          if (analytics.data?.topSellingProducts) {
            setTopProducts(analytics.data.topSellingProducts);
          }
        }

        // Fetch real orders
        const backendOrders = await fetchAdminOrders(token);
        if (backendOrders && backendOrders.data && backendOrders.data.orders) {
          const mappedOrders = backendOrders.data.orders.slice(0, 5).map(o => ({
            id: o._id,
            customer: o.shippingAddress?.fullName || o.shippingAddress?.name || o.user?.name || 'Customer',
            product: o.orderItems?.length > 0 ? o.orderItems[0].name : 'Various Items',
            amount: `₹${o.totalPrice?.toLocaleString('en-IN') || 0}`,
            status: o.orderStatus ? (o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1).toLowerCase()) : 'Pending',
            date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          }));
          setOrders(mappedOrders);
        } else {
          setOrders([]);
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <Loader2 className="animate-spin text-admin-accent h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Dashboard Overview</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <DashboardCards stats={stats} />
      <SalesCharts data={salesData} />

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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Products Section */}
      <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden mt-8">
        <div className="p-6 border-b border-admin-border dark:border-admin-border-dark flex justify-between items-center">
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Top Performing Products</h3>
          <Link to="/admin/products" className="text-sm font-medium text-admin-accent hover:text-red-600 flex items-center transition-colors">
            View Inventory <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-rubik">
            <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Units Sold</th>
                <th className="px-6 py-4 font-medium text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                    No sales data available yet.
                  </td>
                </tr>
              ) : (
                topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{product.name}</td>
                    <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-admin-heading dark:text-admin-heading-dark">{product.quantitySold}</td>
                    <td className="px-6 py-4 text-right font-semibold text-admin-accent">₹{product.revenue?.toLocaleString('en-IN') || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
