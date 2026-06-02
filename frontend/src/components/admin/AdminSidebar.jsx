
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  BarChart3, 
  LogOut,
  Settings
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Tags size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Discounts', path: '/admin/discounts', icon: <Tags size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <aside className="w-64 bg-admin-card dark:bg-admin-card-dark border-r border-admin-border dark:border-admin-border-dark flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 border-b border-admin-border dark:border-admin-border-dark">
        <h2 className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark tracking-wide">
          URBAN<span className="text-admin-accent">WEAR</span>
        </h2>
        <p className="text-xs text-admin-text dark:text-admin-text-dark mt-1 font-rubik tracking-wider uppercase">Admin Panel</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-admin-bg dark:bg-[#222] text-admin-heading dark:text-admin-heading-dark shadow-sm'
                  : 'text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222] hover:text-admin-heading dark:hover:text-admin-heading-dark'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-admin-border dark:border-admin-border-dark space-y-1">
        <button className="bg-transparent border-none outline-none w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222] hover:text-admin-heading dark:hover:text-admin-heading-dark transition-all duration-200 font-medium">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="bg-transparent border-none outline-none w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-admin-accent hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 font-medium">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
