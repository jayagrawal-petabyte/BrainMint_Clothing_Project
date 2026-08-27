import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import InventoryTable from '../../components/admin/InventoryTable';
import { fetchProducts, adminUpdateProduct } from '../../services/api';

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await fetchProducts('?limit=100&isActive=all');
    setProducts(data.products || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    const token = localStorage.getItem('adminToken');
    const product = products.find(p => p._id === id);
    if (!product) return;

    const payload = {
      ...product,
      category: product.categoryId, // Ensure valid ObjectId is sent
      inventory: { ...product.inventory, stock: Number(newStock) }
    };
    
    await adminUpdateProduct(id, payload, token);
    loadProducts();
  };
  
  const lowStockCount = products.filter(p => {
    const stock = p.inventory?.stock || 0;
    return stock > 0 && stock < 15;
  }).length;
  
  const outOfStockCount = products.filter(p => (p.inventory?.stock || 0) === 0).length;

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

      <InventoryTable products={products} searchQuery={searchQuery} onUpdateStock={handleUpdateStock} isLoading={isLoading} />
    </div>
  );
};

export default InventoryManagement;
