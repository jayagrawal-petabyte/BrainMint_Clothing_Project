import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import InventoryTable from '../../components/admin/InventoryTable';

const mockInventory = [
  { id: 1, name: 'Floral Maxi Dress', category: 'Dresses', stock: 45, image: 'https://images.unsplash.com/photo-1572804013309-8c98c41f1481?q=80&w=1000' },
  { id: 2, name: 'Silk Blouse', category: 'Tops', stock: 12, image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000' },
  { id: 3, name: 'Little Black Dress', category: 'Dresses', stock: 0, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000' },
  { id: 4, name: 'Tailored Blazer', category: 'Outerwear', stock: 28, image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1000' },
  { id: 5, name: 'High-Waist Trousers', category: 'Bottoms', stock: 8, image: 'https://images.unsplash.com/photo-1509631179647-0c500ba5e04f?q=80&w=1000' },
];

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const lowStockCount = mockInventory.filter(p => p.stock > 0 && p.stock < 15).length;
  const outOfStockCount = mockInventory.filter(p => p.stock === 0).length;

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Inventory Management</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Track and update your product stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark flex items-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-admin-text dark:text-admin-text-dark">Low Stock Items</p>
            <p className="text-2xl font-bold text-admin-heading dark:text-admin-heading-dark font-montserrat">{lowStockCount}</p>
          </div>
        </div>
        <div className="bg-admin-card dark:bg-admin-card-dark p-6 rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark flex items-center">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-admin-text dark:text-admin-text-dark">Out of Stock</p>
            <p className="text-2xl font-bold text-admin-heading dark:text-admin-heading-dark font-montserrat">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-admin-card dark:bg-admin-card-dark p-4 rounded-t-2xl border-x border-t border-admin-border dark:border-admin-border-dark flex justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-admin-text dark:text-admin-text-dark" />
          </div>
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark focus:border-admin-accent dark:focus:border-admin-accent rounded-xl outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
          />
        </div>
      </div>

      <InventoryTable products={mockInventory} searchQuery={searchQuery} />
    </div>
  );
};

export default InventoryManagement;
