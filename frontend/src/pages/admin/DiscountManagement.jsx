import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import DiscountTable from '../../components/admin/DiscountTable';
import { fetchAdminCoupons, adminCreateCoupon, adminDeleteCoupon } from '../../services/api';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '0',
    maxDiscountAmount: '',
    usageLimit: '',
    validUntil: ''
  });

  const loadCoupons = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const data = await fetchAdminCoupons(token);
    if (data && data.success) {
      setDiscounts(data.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem('adminToken');
    
    // Clean up payload
    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minimumOrderAmount: Number(formData.minimumOrderAmount) || 0,
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
    };

    const res = await adminCreateCoupon(payload, token);
    
    if (res && res.success) {
      setIsModalOpen(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minimumOrderAmount: '0',
        maxDiscountAmount: '',
        usageLimit: '',
        validUntil: ''
      });
      loadCoupons();
    } else {
      setError(res?.message || 'Failed to create discount');
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      const token = localStorage.getItem('adminToken');
      await adminDeleteCoupon(id, token);
      loadCoupons();
    }
  };

  return (
    <div className="animate-in fade-in duration-500 font-rubik relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Discount Management</h1>
          <p className="text-admin-text dark:text-admin-text-dark mt-1">Manage promotional offers and sales</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-admin-accent hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span>Add Discount</span>
        </button>
      </div>

      <DiscountTable discounts={discounts} onDelete={handleDelete} isLoading={isLoading} />

      {/* Add Discount Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-admin-border dark:border-admin-border-dark shadow-xl">
            <div className="sticky top-0 bg-admin-card dark:bg-admin-card-dark p-6 border-b border-admin-border dark:border-admin-border-dark flex justify-between items-center z-10">
              <h2 className="text-xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Create New Discount</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-admin-text hover:text-admin-heading dark:text-admin-text-dark dark:hover:text-admin-heading-dark transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. SUMMER26"
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark uppercase"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Valid Until</label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the promotion"
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Discount Type *</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark appearance-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Discount Value *</label>
                  <input
                    type="number"
                    name="discountValue"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={formData.discountType === 'percentage' ? "e.g. 20" : "e.g. 500"}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    name="minimumOrderAmount"
                    min="0"
                    value={formData.minimumOrderAmount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Max Discount Amount (₹)</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    min="1"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                    placeholder="Leave blank for no limit"
                    disabled={formData.discountType === 'fixed'}
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    min="1"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Total times this can be used"
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-admin-border dark:border-admin-border-dark mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-admin-border dark:border-admin-border-dark rounded-xl text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#1A1A1A] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-admin-accent hover:bg-admin-accent-hover text-white rounded-xl transition-colors font-medium disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Create Discount'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
