import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products, searchQuery, categoryFilter, onDelete, isLoading }) => {
  const filteredProducts = products.filter(product => {
    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden font-rubik">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
            {isLoading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">Loading products...</td></tr>
            ) : filteredProducts.map((product) => {
              const image = (product.images && product.images[0]) ? product.images[0].url : 'https://placehold.co/100x100?text=No+Image';
              const stock = product.inventory?.stock || 0;
              const status = product.isActive ? 'Active' : 'Draft';
              const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
              
              return (
              <tr key={product._id} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-admin-border dark:border-admin-border-dark bg-admin-bg dark:bg-[#1A1A1A]">
                      <img className="h-full w-full object-cover" src={image} alt={product.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{categoryName}</td>
                <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">₹{product.price?.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{stock}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}
                  `}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button className="text-admin-text hover:text-blue-500 dark:text-admin-text-dark dark:hover:text-blue-400 transition-colors" title="View">
                    <Eye size={18} />
                  </button>
                  <Link to={`/admin/products/edit/${product._id}`} className="text-admin-text hover:text-emerald-500 dark:text-admin-text-dark dark:hover:text-emerald-400 transition-colors inline-block" title="Edit">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => onDelete(product._id)} className="text-admin-text hover:text-red-500 dark:text-admin-text-dark dark:hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )})}
            
            {!isLoading && filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                  No products found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
