import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-admin-bg dark:bg-admin-bg-dark font-rubik text-admin-text dark:text-admin-text-dark transition-colors duration-300">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-admin-bg dark:bg-admin-bg-dark p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
