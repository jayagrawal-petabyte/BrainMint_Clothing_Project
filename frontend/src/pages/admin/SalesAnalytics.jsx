import React from 'react';
import SalesCharts from '../../components/admin/SalesCharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const SalesAnalytics = () => {
  const topProducts = [
    { name: 'Floral Maxi Dress', category: 'Dresses', sales: 124, revenue: '₹6,19,876' },
    { name: 'Silk Blouse', category: 'Tops', sales: 98, revenue: '₹3,42,902' },
    { name: 'Tailored Blazer', category: 'Outerwear', sales: 76, revenue: '₹5,31,924' },
    { name: 'High-Waist Trousers', category: 'Bottoms', sales: 65, revenue: '₹2,59,935' },
  ];

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Sales Analytics</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Detailed breakdown of your store's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-admin-text dark:text-admin-text-dark">Gross Revenue</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
              <IndianRupee size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-1">₹32.4L</p>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-emerald-500 font-medium mr-2">
              <ArrowUpRight size={16} className="mr-1" /> +15.2%
            </span>
            <span className="text-admin-text dark:text-admin-text-dark">from last month</span>
          </div>
        </div>

        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-admin-text dark:text-admin-text-dark">Net Profit</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-1">₹8.2L</p>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-emerald-500 font-medium mr-2">
              <ArrowUpRight size={16} className="mr-1" /> +8.4%
            </span>
            <span className="text-admin-text dark:text-admin-text-dark">from last month</span>
          </div>
        </div>

        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-admin-text dark:text-admin-text-dark">Conversion Rate</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-1">3.24%</p>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-red-500 font-medium mr-2">
              <ArrowDownRight size={16} className="mr-1" /> -0.8%
            </span>
            <span className="text-admin-text dark:text-admin-text-dark">from last month</span>
          </div>
        </div>

        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-admin-text dark:text-admin-text-dark">Avg. Order Value</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-1">₹4,250</p>
          <div className="flex items-center text-sm">
            <span className="flex items-center text-emerald-500 font-medium mr-2">
              <ArrowUpRight size={16} className="mr-1" /> +2.1%
            </span>
            <span className="text-admin-text dark:text-admin-text-dark">from last month</span>
          </div>
        </div>
      </div>

      <SalesCharts />

      <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden mt-8">
        <div className="p-6 border-b border-admin-border dark:border-admin-border-dark">
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Units Sold</th>
                <th className="px-6 py-4 font-medium text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{product.name}</td>
                  <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-admin-heading dark:text-admin-heading-dark">{product.sales}</td>
                  <td className="px-6 py-4 text-right font-semibold text-admin-accent">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
