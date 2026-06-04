import React, { useState, useEffect } from 'react';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { adminUpdateProduct, fetchProductById, fetchCategories } from '../../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProductById(id).then(data => {
      if (data) {
        setProductData({
          name: data.name || '',
          description: data.description || '',
          category: data.categoryId || data.category || '',
          price: data.price || '',
          discount: data.discountPrice ? Math.round(((data.price - data.discountPrice) / data.price) * 100) : '',
          stock: data.inventory?.stock || '',
          status: data.isActive ? 'Active' : 'Draft',
          sizes: data.sizes || [],
          colors: data.colors || [],
          images: data.images && data.images.length > 0 ? data.images.map(img => img.url) : ['']
        });
      }
      setIsLoading(false);
    });
  }, [id]);

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
        stock: Number(formData.stock)
      },
      sizes: formData.sizes || [],
      colors: formData.colors || [],
      isActive: formData.status === 'Active',
      images: formData.images ? formData.images.map(url => ({ url })) : []
    };
    
    return await adminUpdateProduct(id, payload, token);
  };

  return (
    <div className="animate-in fade-in duration-500 font-rubik max-w-6xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/products" className="inline-flex items-center text-sm font-medium text-admin-text hover:text-admin-accent dark:text-admin-text-dark dark:hover:text-admin-accent transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Edit Product</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Update the product information below.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-admin-accent w-12 h-12" />
        </div>
      ) : productData ? (
        <ProductForm initialData={productData} isEditing={true} onSubmit={handleSubmit} categories={categories} />
      ) : (
        <div className="text-center text-admin-text dark:text-admin-text-dark mt-12">Product not found.</div>
      )}
    </div>
  );
};

export default EditProduct;
