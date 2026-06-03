import React, { useState } from 'react';
import { AlertCircle, Edit2, Loader2, Check } from 'lucide-react';

const InventoryTable = ({ products, searchQuery, onUpdateStock, isLoading }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [stockInputs, setStockInputs] = useState({});

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden font-rubik">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Product Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Current Stock</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Update Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
            {isLoading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">Loading inventory...</td></tr>
            ) : filteredProducts.map((product) => {
              const image = (product.images && product.images[0]) ? product.images[0].url : 'https://placehold.co/100x100?text=No+Image';
              const stock = product.inventory?.stock || 0;
              const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
              
              const handleStockChange = (e) => {
                setStockInputs(prev => ({ ...prev, [product._id]: e.target.value }));
              };

              const submitStockUpdate = async () => {
                const newStock = stockInputs[product._id];
                if (newStock !== undefined && newStock !== String(stock)) {
                  setUpdatingId(product._id);
                  await onUpdateStock(product._id, newStock);
                  setUpdatingId(null);
                }
              };

              return (
              <tr key={product._id} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded overflow-hidden mr-3">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">{categoryName}</td>
                <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">
                  {stock}
                </td>
                <td className="px-6 py-4">
                  {stock === 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                      <AlertCircle size={12} className="mr-1" /> Out of Stock
                    </span>
                  ) : stock < 15 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
                      <AlertCircle size={12} className="mr-1" /> Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <input 
                      type="number" 
                      value={stockInputs[product._id] !== undefined ? stockInputs[product._id] : stock}
                      onChange={handleStockChange}
                      className="w-16 px-2 py-1 text-sm bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded focus:ring-1 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark text-center"
                    />
                    <button 
                      onClick={submitStockUpdate}
                      disabled={updatingId === product._id || (stockInputs[product._id] === undefined || stockInputs[product._id] === String(stock))}
                      className="p-1 text-admin-text hover:text-emerald-500 dark:text-admin-text-dark dark:hover:text-emerald-400 transition-colors bg-admin-bg dark:bg-[#222] rounded border border-admin-border dark:border-admin-border-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === product._id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
