import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';

const AdminTopbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <header className="h-20 bg-admin-card dark:bg-admin-card-dark border-b border-admin-border dark:border-admin-border-dark flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-admin-text dark:text-admin-text-dark" />
        </div>
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full pl-10 pr-4 py-2.5 bg-admin-bg dark:bg-[#222] border border-transparent focus:border-admin-border dark:focus:border-[#444] rounded-lg outline-none text-admin-heading dark:text-admin-heading-dark placeholder-admin-text dark:placeholder-admin-text-dark transition-all duration-200 font-rubik"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="bg-transparent border-none outline-none text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <button className="bg-transparent border-none outline-none relative text-admin-text dark:text-admin-text-dark hover:text-admin-heading dark:hover:text-admin-heading-dark transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-admin-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-admin-card dark:border-admin-card-dark">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-admin-border dark:bg-admin-border-dark"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-admin-border-dark flex items-center justify-center text-admin-heading dark:text-admin-heading-dark group-hover:border-admin-accent transition-colors">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark font-montserrat">Admin User</span>
            <span className="text-xs text-admin-text dark:text-admin-text-dark font-rubik">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
