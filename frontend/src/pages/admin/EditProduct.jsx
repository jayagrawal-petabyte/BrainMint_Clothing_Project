import React from 'react';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();

  // Mock data fetching based on ID
  const mockProductData = {
    name: 'Floral Maxi Dress',
    description: 'A beautiful floral maxi dress perfect for summer days. Features a lightweight fabric and comfortable fit.',
    category: 'Dresses',
    price: '4999',
    discount: '10',
    stock: '45',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1572804013309-8c98c41f1481?q=80&w=1000&auto=format&fit=crop'
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

      <ProductForm initialData={mockProductData} isEditing={true} />
    </div>
  );
};

export default EditProduct;
