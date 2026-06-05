import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';

const DiscountTable = ({ discounts, onDelete, isLoading }) => {
  return (
    <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden font-rubik">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Coupon Code</th>
              <th className="px-6 py-4 font-medium">Discount Value</th>
              <th className="px-6 py-4 font-medium">Min Order</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-admin-accent border-t-transparent rounded-full animate-spin"></div>
                    Loading coupons...
                  </div>
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                  No discounts found.
                </td>
              </tr>
            ) : (
              discounts.map((discount) => {
                const isExpired = discount.validUntil && new Date(discount.validUntil) < new Date();
                const status = !discount.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active';
                
                return (
                  <tr key={discount._id} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-admin-bg dark:bg-[#1A1A1A] flex items-center justify-center mr-3 border border-admin-border dark:border-admin-border-dark flex-shrink-0">
                          <Tag size={14} className="text-admin-accent" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark uppercase">{discount.code}</div>
                          {discount.description && <div className="text-xs text-admin-text dark:text-admin-text-dark">{discount.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-admin-accent">
                      {discount.discountType === 'percentage' 
                        ? `${discount.discountValue}% OFF` 
                        : `₹${discount.discountValue} OFF`}
                    </td>
                    <td className="px-6 py-4 text-admin-heading dark:text-admin-heading-dark">
                      {discount.minimumOrderAmount > 0 ? `₹${discount.minimumOrderAmount}` : 'None'}
                    </td>
                    <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark">
                      {discount.usedCount} / {discount.usageLimit || '∞'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : ''}
                        ${status === 'Expired' ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : ''}
                        ${status === 'Inactive' ? 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700' : ''}
                      `}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      {/* <button className="text-admin-text hover:text-emerald-500 dark:text-admin-text-dark dark:hover:text-emerald-400 transition-colors" title="Edit Discount">
                        <Edit2 size={18} />
                      </button> */}
                      <button 
                        onClick={() => onDelete && onDelete(discount._id)}
                        className="text-admin-text hover:text-red-500 dark:text-admin-text-dark dark:hover:text-red-400 transition-colors" 
                        title="Remove Discount"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountTable;
