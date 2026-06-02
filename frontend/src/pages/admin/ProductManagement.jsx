import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';

const mockProducts = [
  { id: 1, name: 'Floral Maxi Dress', category: 'Dresses', price: 4999, stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1572804013309-8c98c41f1481?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, name: 'Silk Blouse', category: 'Tops', price: 3499, stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, name: 'Little Black Dress', category: 'Dresses', price: 5999, stock: 0, status: 'Draft', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop' },
  { id: 4, name: 'Tailored Blazer', category: 'Outerwear', price: 6999, stock: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1000&auto=format&fit=crop' },
  { id: 5, name: 'High-Waist Trousers', category: 'Bottoms', price: 3999, stock: 8, status: 'Active', image: 'https://images.unsplash.com/photo-1509631179647-0c500ba5e04f?q=80&w=1000&auto=format&fit=crop' },
];

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Products</h1>
          <p className="text-admin-text dark:text-admin-text-dark mt-1">Manage your product catalog</p>
        </div>
        <Link 
          to="/admin/products/add" 
          className="flex items-center justify-center space-x-2 bg-admin-accent hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-admin-card dark:bg-admin-card-dark p-4 rounded-t-2xl border-x border-t border-admin-border dark:border-admin-border-dark flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-admin-text dark:text-admin-text-dark" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark focus:border-admin-accent dark:focus:border-admin-accent rounded-xl outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
          />
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2.5 border border-admin-border dark:border-admin-border-dark rounded-xl text-admin-heading dark:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#1A1A1A] transition-colors w-full sm:w-auto justify-center">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <ProductTable products={mockProducts} searchQuery={searchQuery} />
    </div>
  );
};

export default ProductManagement;
