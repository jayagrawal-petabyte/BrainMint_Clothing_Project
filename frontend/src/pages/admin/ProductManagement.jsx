import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';
import { fetchProducts, adminDeleteProduct } from '../../services/api';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await fetchProducts('?limit=100');
    setProducts(data.products || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const token = localStorage.getItem('adminToken');
      await adminDeleteProduct(id, token);
      loadProducts();
    }
  };

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

      <ProductTable products={products} searchQuery={searchQuery} onDelete={handleDelete} isLoading={isLoading} />
    </div>
  );
};

export default ProductManagement;
