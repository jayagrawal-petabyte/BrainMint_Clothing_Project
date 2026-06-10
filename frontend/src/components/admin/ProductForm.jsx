import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Plus, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
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
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState(() => {
    if (initialData && initialData.images && initialData.images.length > 0) {
      return initialData.images
        .filter(url => typeof url === 'string' && url.trim() !== '')
        .map((url, index) => ({
          id: `existing-${index}-${Date.now()}`,
          url: url,
          file: null,
          isLocal: false,
          name: url.substring(url.lastIndexOf('/') + 1) || `image-${index + 1}`,
          size: null,
          status: 'Saved'
        }));
    }
    return [];
  });

  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);
  const createdBlobUrls = useRef(new Set());

  useEffect(() => {
    if (initialData && initialData.images) {
      const initialImages = initialData.images
        .filter(url => typeof url === 'string' && url.trim() !== '')
        .map((url, index) => ({
          id: `existing-${index}-${Date.now()}`,
          url: url,
          file: null,
          isLocal: false,
          name: url.substring(url.lastIndexOf('/') + 1) || `Image ${index + 1}`,
          size: null,
          status: 'Saved'
        }));
      setUploadedImages(initialImages);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      images: uploadedImages.map(img => img.url)
    }));
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      createdBlobUrls.current.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return { isValid: false, message: `File "${file.name}" is not a valid format. Only JPG, PNG, and WEBP are supported.` };
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, message: `File "${file.name}" exceeds the 5MB size limit.` };
    }
    return { isValid: true };
  };

  const handleFilesAdded = (filesList) => {
    setValidationError(null);
    const validFiles = [];
    let errors = [];

    const currentCount = uploadedImages.length;
    const remainingSlots = 4 - currentCount;

    if (filesList.length > remainingSlots) {
      errors.push(`You can only upload up to 4 images. ${remainingSlots} slot(s) remaining.`);
    }

    const filesToProcess = Array.from(filesList).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const validation = validateFile(file);
      if (validation.isValid) {
        const url = URL.createObjectURL(file);
        createdBlobUrls.current.add(url);
        validFiles.push({
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          file: file,
          isLocal: true,
          name: file.name,
          size: file.size,
          status: 'Ready'
        });
      } else {
        errors.push(validation.message);
      }
    });

    if (errors.length > 0) {
      setValidationError(errors.join(' '));
    }

    if (validFiles.length > 0) {
      setUploadedImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    
    setValidationError(null);
    if (uploadedImages.length >= 4) {
      setValidationError("You can only add up to 4 images.");
      return;
    }

    try {
      new URL(imageUrlInput); // Basic validation
      setUploadedImages(prev => [
        ...prev, 
        {
          id: `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: imageUrlInput.trim(),
          file: null,
          isLocal: false,
          name: imageUrlInput.substring(imageUrlInput.lastIndexOf('/') + 1) || 'Linked Image',
          size: null,
          status: 'Ready'
        }
      ]);
      setImageUrlInput('');
    } catch (err) {
      setValidationError("Please enter a valid HTTP or HTTPS URL.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const triggerReplace = (index) => {
    setReplaceIndex(index);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  const handleFileReplaced = (e) => {
    if (e.target.files && e.target.files.length > 0 && replaceIndex !== null) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation.isValid) {
        setValidationError(null);
        
        const oldImage = uploadedImages[replaceIndex];
        if (oldImage && oldImage.isLocal && oldImage.url) {
          URL.revokeObjectURL(oldImage.url);
          createdBlobUrls.current.delete(oldImage.url);
        }

        const url = URL.createObjectURL(file);
        createdBlobUrls.current.add(url);

        const newImage = {
          id: `local-replaced-${Date.now()}`,
          url: url,
          file: file,
          isLocal: true,
          name: file.name,
          size: file.size,
          status: 'Ready'
        };

        setUploadedImages(prev => {
          const updated = [...prev];
          updated[replaceIndex] = newImage;
          return updated;
        });
      } else {
        setValidationError(validation.message);
      }
      setReplaceIndex(null);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = uploadedImages[index];
    if (imageToRemove && imageToRemove.isLocal && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url);
      createdBlobUrls.current.delete(imageToRemove.url);
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    if (direction === 'left' && index > 0) {
      setUploadedImages(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index - 1];
        updated[index - 1] = temp;
        return updated;
      });
    } else if (direction === 'right' && index < uploadedImages.length - 1) {
      setUploadedImages(prev => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[index + 1];
        updated[index + 1] = temp;
        return updated;
      });
    }
  };

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const finalImages = [];
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];
        if (img.isLocal && img.file) {
          if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary credentials are not configured in .env');
          }
          
          const formDataObj = new FormData();
          formDataObj.append('file', img.file);
          formDataObj.append('upload_preset', uploadPreset);
          
          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formDataObj
          });
          
          if (!uploadRes.ok) {
            throw new Error(`Failed to upload image ${img.name}`);
          }
          
          const uploadData = await uploadRes.json();
          finalImages.push(uploadData.secure_url);
        } else {
          finalImages.push(img.url);
        }
      }

      const cleanedFormData = {
        ...formData,
        images: finalImages.filter(url => url && url.trim() !== '' && !url.startsWith('blob:'))
      };
    
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
      setError(err.message || 'An unexpected error occurred.');
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
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl p-6 shadow-sm border border-admin-border dark:border-admin-border-dark backdrop-blur-md bg-white/95 dark:bg-admin-card-dark/95">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-lg font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Product Images</h3>
                <p className="text-xs text-admin-text dark:text-admin-text-dark mt-0.5">
                  Set the primary image and add gallery files.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-admin-bg dark:bg-[#222] text-admin-heading dark:text-admin-heading-dark border border-admin-border dark:border-admin-border-dark">
                {uploadedImages.length} / 4 Images
              </span>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{validationError}</span>
                </div>
                <button type="button" onClick={() => setValidationError(null)} className="hover:text-red-800 dark:hover:text-red-300 font-bold ml-1">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Drag and Drop Zone */}
            {uploadedImages.length < 4 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  isDragging
                    ? 'border-admin-accent bg-admin-accent/5 dark:bg-admin-accent/10 shadow-[0_0_15px_rgba(242,76,92,0.15)] scale-[0.99]'
                    : 'border-admin-border dark:border-admin-border-dark bg-admin-bg/50 dark:bg-[#1A1A1A]/30 hover:border-admin-accent/50 hover:bg-admin-accent/5 hover:shadow-sm'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesAdded(e.target.files);
                    }
                  }}
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-admin-accent/0 to-admin-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className={`p-4 rounded-full bg-white dark:bg-[#222] border border-admin-border dark:border-admin-border-dark shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                  isDragging ? 'border-admin-accent text-admin-accent scale-110' : 'text-admin-text dark:text-admin-text-dark'
                }`}>
                  <Upload size={24} className={isDragging ? 'animate-bounce' : ''} />
                </div>
                
                <h4 className="mt-4 font-semibold text-sm text-admin-heading dark:text-admin-heading-dark">
                  Drag & Drop Images Here
                </h4>
                <p className="mt-1 text-xs text-admin-text dark:text-admin-text-dark">
                  or <span className="text-admin-accent font-semibold group-hover:underline">Browse Files</span>
                </p>
                <p className="mt-3 text-[10px] text-admin-text/70 dark:text-admin-text-dark/50">
                  Supports PNG, JPG, WEBP (Max 5MB each)
                </p>
              </div>
            )}

            {/* Hidden Input for Replace Action */}
            <input
              type="file"
              ref={replaceFileInputRef}
              onChange={handleFileReplaced}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {/* URL Input Zone */}
            {uploadedImages.length < 4 && (
              <div className="mt-4 flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="flex-1 px-4 py-2 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:ring-2 focus:ring-admin-accent focus:border-transparent outline-none text-sm text-admin-heading dark:text-admin-heading-dark transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddImageUrl(e)}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-admin-bg dark:bg-[#222] border border-admin-border dark:border-admin-border-dark hover:border-admin-accent/50 hover:bg-admin-accent/10 rounded-xl text-sm font-semibold text-admin-heading dark:text-admin-heading-dark transition-all"
                >
                  Add URL
                </button>
              </div>
            )}

            {/* Previews Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {uploadedImages.map((img, index) => {
                  const fileSizeFormatted = img.size ? `${(img.size / (1024 * 1024)).toFixed(2)} MB` : '';
                  return (
                    <div
                      key={img.id}
                      className="group relative rounded-xl overflow-hidden border border-admin-border dark:border-admin-border-dark aspect-[3/4] bg-admin-bg dark:bg-[#1A1A1A] shadow-sm hover:shadow-md hover:border-admin-accent/40 transition-all duration-300"
                    >
                      {/* Image Preview */}
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start pointer-events-none z-10">
                        {/* Primary Badge or Index */}
                        {index === 0 ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-admin-accent text-white shadow-sm border border-admin-accent/20">
                            Primary
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/95 dark:bg-black/80 text-admin-heading dark:text-admin-heading-dark border border-admin-border dark:border-admin-border-dark/50 shadow-sm">
                            {index + 1}
                          </span>
                        )}

                        {/* Status Label (Glassmorphic) */}
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wide border backdrop-blur-md pointer-events-auto shadow-sm ${
                          img.status === 'Saved'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        }`}>
                          {img.status}
                        </span>
                      </div>

                      {/* Info Bar at bottom (Fades on hover) */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-end min-h-[45px] pointer-events-none">
                        <p className="text-[10px] font-medium truncate w-full shadow-sm pr-1">{img.name}</p>
                        {fileSizeFormatted && <p className="text-[8px] text-gray-300 font-light mt-0.5">{fileSizeFormatted}</p>}
                      </div>

                      {/* Glassmorphic Interaction Overlay (Appears on Hover) */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-20">
                        
                        {/* Delete Action (Top right) */}
                        <div className="flex justify-end w-full">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            title="Remove Image"
                            className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Middle Action: Reorder / Swap */}
                        <div className="flex justify-center items-center gap-3">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'left')}
                              title="Move Left (Make Primary)"
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                              <ChevronLeft size={16} />
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => triggerReplace(index)}
                            title="Replace Image"
                            className="p-2.5 rounded-full bg-admin-accent hover:bg-red-600 text-white shadow-lg hover:scale-115 active:scale-95 transition-all duration-200 flex items-center justify-center"
                          >
                            <RefreshCw size={14} />
                          </button>

                          {index < uploadedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'right')}
                              title="Move Right"
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>

                        {/* Info details */}
                        <div className="text-center w-full text-[9px] text-gray-300 font-light truncate">
                          {img.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
