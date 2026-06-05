import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-admin-bg dark:bg-admin-bg-dark font-rubik text-admin-text dark:text-admin-text-dark transition-colors duration-300 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminTopbar toggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-admin-bg dark:bg-admin-bg-dark p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
