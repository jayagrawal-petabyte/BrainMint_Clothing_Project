import React from 'react';
import { Package, IndianRupee, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardCards = ({ stats }) => {
  const defaultStats = [
    {
      title: 'Total Revenue',
      value: '₹0',
      change: '-',
      isPositive: false,
      icon: <IndianRupee size={24} className="text-white" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Orders',
      value: '0',
      change: '-',
      isPositive: false,
      icon: <ShoppingBag size={24} className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: '0',
      change: '-',
      isPositive: false,
      icon: <Users size={24} className="text-white" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Products',
      value: '0',
      change: '-',
      isPositive: false,
      icon: <Package size={24} className="text-white" />,
      color: 'bg-orange-500',
    },
  ];

  const displayStats = stats || defaultStats;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 14
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {displayStats.map((stat, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: '0px 12px 24px rgba(0,0,0,0.1)' }}
          className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-admin-text dark:text-admin-text-dark font-rubik mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-4">{stat.value}</h3>
              
              <div className="flex items-center space-x-1">
                <span className={`flex items-center text-sm font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </span>
                <span className="text-sm text-admin-text dark:text-admin-text-dark">vs last month</span>
              </div>
            </div>
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardCards;
