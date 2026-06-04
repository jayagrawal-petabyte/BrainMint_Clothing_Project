import React, { useState, useEffect } from 'react';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { adminCreateProduct, fetchCategories } from '../../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('adminToken');
    const payload = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      discountPrice: formData.discount ? Number(formData.price) - (Number(formData.price) * Number(formData.discount) / 100) : undefined,
      inventory: { 
        stock: Number(formData.stock),
        sku: 'SKU-' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase()
      },
      isActive: formData.status === 'Active',
      images: formData.imageUrl ? [{ url: formData.imageUrl }] : []
    };
    
    return await adminCreateProduct(payload, token);
  };

  return (
    <div className="animate-in fade-in duration-500 font-rubik max-w-6xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/products" className="inline-flex items-center text-sm font-medium text-admin-text hover:text-admin-accent dark:text-admin-text-dark dark:hover:text-admin-accent transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Add New Product</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Fill in the details to add a new product to your catalog.</p>
      </div>

      <ProductForm onSubmit={handleSubmit} categories={categories} />
    </div>
  );
};

export default AddProduct;
