import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';

const DiscountTable = ({ discounts }) => {
  return (
    <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden font-rubik">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-admin-bg dark:bg-[#222] text-admin-text dark:text-admin-text-dark text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Product / Collection</th>
              <th className="px-6 py-4 font-medium">Original Price</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Final Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
            {discounts.map((discount) => (
              <tr key={discount.id} className="hover:bg-admin-bg/50 dark:hover:bg-[#222]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-admin-bg dark:bg-[#1A1A1A] flex items-center justify-center mr-3 border border-admin-border dark:border-admin-border-dark">
                      <Tag size={14} className="text-admin-accent" />
                    </div>
                    <div className="text-sm font-semibold text-admin-heading dark:text-admin-heading-dark">{discount.productName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-admin-text dark:text-admin-text-dark line-through">{discount.originalPrice}</td>
                <td className="px-6 py-4 font-semibold text-admin-accent">{discount.percentage}% OFF</td>
                <td className="px-6 py-4 font-semibold text-admin-heading dark:text-admin-heading-dark">{discount.discountedPrice}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    ${discount.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}
                  `}>
                    {discount.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button className="text-admin-text hover:text-emerald-500 dark:text-admin-text-dark dark:hover:text-emerald-400 transition-colors" title="Edit Discount">
                    <Edit2 size={18} />
                  </button>
                  <button className="text-admin-text hover:text-red-500 dark:text-admin-text-dark dark:hover:text-red-400 transition-colors" title="Remove Discount">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountTable;
