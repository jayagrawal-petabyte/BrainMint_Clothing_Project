import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';

const salesData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
];

const SalesCharts = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');

    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? '#AAAAAA' : '#555555';
  const gridColor = isDark ? '#333333' : '#E5E5E5';
  const tooltipBg = isDark ? '#1A1A1A' : '#FFFFFF';

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 font-rubik"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
    >
      {/* Revenue Chart */}
      <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
        <div className="mb-6">
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Revenue Overview</h3>
          <p className="text-sm text-admin-text dark:text-admin-text-dark">Monthly revenue tracking</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F24C5C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F24C5C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, borderRadius: '8px', color: isDark ? '#fff' : '#000' }}
                itemStyle={{ color: '#F24C5C' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F24C5C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
        <div className="mb-6">
          <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Orders Overview</h3>
          <p className="text-sm text-admin-text dark:text-admin-text-dark">Monthly order volume</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: isDark ? '#333' : '#F5F5F5' }}
                contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, borderRadius: '8px', color: isDark ? '#fff' : '#000' }}
              />
              <Bar dataKey="orders" fill={isDark ? '#F5F5F5' : '#111111'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesCharts;
