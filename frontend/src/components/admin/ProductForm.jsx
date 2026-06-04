import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getColorName } from '../../utils/helpers';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000', 
  '#FFFF00', '#808080', '#000080', '#FFC0CB', '#800080', '#FFA500', '#A52A2A'
];

const ProductForm = ({ initialData, isEditing = false, onSubmit, categories = [] }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    status: 'Active',
    sizes: [],
    colors: [],
    images: [''] // start with 1 empty input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 4) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    if (newImages.length === 0) newImages.push(''); // ensure at least 1 input
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Filter out empty images
    const cleanedFormData = {
      ...formData,
      images: formData.images.filter(url => url.trim() !== '')
    };
    
    try {
      if (onSubmit) {
        const res = await onSubmit(cleanedFormData);
        if (res && res.success === false) {
          setError(res.message || 'Failed to save product. Please check the details and try again.');
        } else if (res === false) {
          setError('Failed to save product. Please check the details and try again.');
        } else {
          navigate('/admin/products');
        }
      } else {
        navigate('/admin/products');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-rubik space-y-8">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
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

          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark mb-6">Variants</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-3">Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_SIZES.map(size => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-[#444] px-4 py-2 rounded-lg hover:border-admin-accent transition-colors">
                      <input 
                        type="checkbox" 
                        checked={(formData.sizes || []).includes(size)}
                        onChange={() => handleCheckboxChange('sizes', size)}
                        className="accent-admin-accent w-4 h-4"
                      />
                      <span className="text-sm font-medium text-admin-heading dark:text-admin-heading-dark">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-heading dark:text-admin-heading-dark mb-3">Colors</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_COLORS.map(color => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-[#444] px-4 py-2 rounded-lg hover:border-admin-accent transition-colors">
                      <input 
                        type="checkbox" 
                        checked={(formData.colors || []).includes(color)}
                        onChange={() => handleCheckboxChange('colors', color)}
                        className="accent-admin-accent w-4 h-4"
                      />
                      <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: color }}></div>
                      <span className="text-sm font-medium text-admin-heading dark:text-admin-heading-dark">{getColorName(color)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Media & Status */}
        <div className="space-y-6">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Product Images</h3>
              {formData.images.length < 4 && (
                <button type="button" onClick={addImageField} className="text-xs flex items-center gap-1 text-admin-accent hover:text-admin-accent/80 font-medium">
                  <Plus size={14} /> Add Image
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {formData.images.map((url, index) => (
                <div key={index} className="space-y-3 p-4 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-[#444] rounded-xl relative">
                  {formData.images.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeImageField(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 bg-white/80 dark:bg-black/50 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <label className="block text-xs font-medium text-admin-heading dark:text-admin-heading-dark">Image URL {index + 1}</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#222] border border-admin-border dark:border-admin-border-dark rounded-lg focus:ring-1 focus:ring-admin-accent outline-none text-sm text-admin-heading dark:text-admin-heading-dark transition-all"
                  />
                  
                  {url ? (
                    <div className="rounded-lg overflow-hidden border border-admin-border dark:border-admin-border-dark aspect-[4/3] relative">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full aspect-[4/3] border border-dashed border-admin-border dark:border-[#555] rounded-lg bg-white/50 dark:bg-[#222]/50">
                      <p className="text-xs text-admin-text dark:text-admin-text-dark font-medium">Image preview</p>
                    </div>
                  )}
                </div>
              ))}
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
          disabled={isSubmitting}
          className="px-6 py-3 bg-admin-accent hover:bg-red-600 text-white rounded-xl font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isEditing ? 'Update Product' : 'Publish Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
