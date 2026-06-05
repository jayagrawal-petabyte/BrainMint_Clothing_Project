
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  BarChart3, 
  LogOut,
  Settings,
  Folder,
  Mail,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Folder size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Tags size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Discounts', path: '/admin/discounts', icon: <Tags size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={20} /> },
  ];

  return (
    <aside className={`w-64 bg-admin-card dark:bg-admin-card-dark border-r border-admin-border dark:border-admin-border-dark flex flex-col h-screen fixed md:sticky top-0 z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-6 border-b border-admin-border dark:border-admin-border-dark flex items-center justify-between">
        <div>
          <Link to="/" className="inline-block" onClick={() => setIsOpen(false)}>
            <h2 className="text-2xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark tracking-wide">
              URBAN<span className="text-admin-accent">WEAR</span>
            </h2>
          </Link>
          <p className="text-xs text-admin-text dark:text-admin-text-dark mt-1 font-rubik tracking-wider uppercase">Admin Panel</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-admin-text dark:text-admin-text-dark hover:text-admin-accent"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium z-10 ${
                isActive
                  ? 'text-admin-heading dark:text-admin-heading-dark font-semibold'
                  : 'text-admin-text dark:text-admin-text-dark hover:bg-admin-bg/30 dark:hover:bg-[#222]/30 hover:text-admin-heading dark:hover:text-admin-heading-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon}
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-admin-nav"
                    className="absolute inset-0 bg-admin-bg dark:bg-[#222] rounded-lg -z-10 shadow-sm border-l-2 border-admin-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-admin-border dark:border-admin-border-dark space-y-1">
        <NavLink
          to="/admin/settings"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              isActive
                ? 'bg-admin-bg dark:bg-[#222] text-admin-heading dark:text-admin-heading-dark font-semibold border-l-2 border-admin-accent'
                : 'bg-transparent text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#222] hover:text-admin-heading dark:hover:text-admin-heading-dark'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={() => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          }}
          className="bg-transparent border-none outline-none w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-admin-accent hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
