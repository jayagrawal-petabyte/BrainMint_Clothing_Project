import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ initialData, isEditing = false, onSubmit, categories = [] }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    status: 'Active',
    imageUrl: ''
  });

  const [previewImage, setPreviewImage] = useState(initialData?.imageUrl || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'imageUrl') {
      setPreviewImage(value);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
    navigate('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="font-rubik space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-6">General Information</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
                  placeholder="e.g. Floral Summer Dress"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all resize-none"
                  placeholder="Describe the product..."
                />
              </div>
            </div>
          </div>

          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-6">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                  <option value="hoodie">Hoodie (Fallback)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Status */}
        <div className="space-y-6">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-6">Product Media</h3>
            
            <div className="space-y-4">
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all mb-4"
                />
                
                {previewImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-admin-border dark:border-admin-border-dark aspect-[3/4]">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-admin-border dark:border-[#444] rounded-xl bg-admin-bg/50 dark:bg-[#1A1A1A]/50">
                    <p className="text-sm text-admin-text dark:text-admin-text-dark font-medium">Image preview will appear here</p>
                  </div>
                )}
            </div>
          </div>

          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-6">Status</h3>
            
            <div>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-admin-heading dark:text-admin-heading-dark transition-all appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-admin-border dark:border-admin-border-dark">
        <button 
          type="button"
          onClick={() => navigate('/admin/products')}
          className="px-6 py-3 border border-admin-border dark:border-[#444] rounded-xl text-admin-heading dark:text-admin-heading-dark hover:bg-admin-bg dark:hover:bg-[#222] font-semibold transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-3 bg-admin-accent hover:bg-red-600 text-white rounded-xl font-semibold shadow-sm transition-colors"
        >
          {isEditing ? 'Update Product' : 'Publish Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
