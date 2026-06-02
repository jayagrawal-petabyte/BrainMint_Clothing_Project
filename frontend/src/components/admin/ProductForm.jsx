import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    status: 'Active',
    images: []
  });

  const [previewImage, setPreviewImage] = useState(initialData?.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, images: [file] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log('Submitting:', formData);
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
                  <option value="Dresses">Dresses</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
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
              <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark">Product Image</label>
              
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
                <label className="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-admin-border dark:border-[#444] rounded-xl cursor-pointer hover:bg-admin-bg dark:hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-admin-text dark:text-admin-text-dark" />
                    <p className="mb-2 text-sm text-admin-text dark:text-admin-text-dark font-medium">Click to upload</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
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
