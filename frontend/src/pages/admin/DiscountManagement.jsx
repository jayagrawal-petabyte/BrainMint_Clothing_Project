import React from 'react';
import DiscountTable from '../../components/admin/DiscountTable.jsx';
import { Plus } from 'lucide-react';

const mockDiscounts = [
  { id: 1, productName: 'Floral Maxi Dress', originalPrice: '₹4,999', percentage: 20, discountedPrice: '₹3,999', status: 'Active' },
  { id: 2, productName: 'Summer Collection 2026', originalPrice: 'Varies', percentage: 15, discountedPrice: 'Varies', status: 'Active' },
  { id: 3, productName: 'Tailored Blazer', originalPrice: '₹6,999', percentage: 10, discountedPrice: '₹6,299', status: 'Expired' },
  { id: 4, productName: 'All Accessories', originalPrice: 'Varies', percentage: 25, discountedPrice: 'Varies', status: 'Active' },
];

const DiscountManagement = () => {
  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Discount Management</h1>
          <p className="text-admin-text dark:text-admin-text-dark mt-1">Manage promotional offers and sales</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-admin-accent hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors">
          <Plus size={20} />
          <span>Add Discount</span>
        </button>
      </div>

      <DiscountTable discounts={mockDiscounts} />
    </div>
  );
};

export default DiscountManagement;
