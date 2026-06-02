import React from 'react';
import ProductForm from '../../components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct = () => {
  return (
    <div className="animate-in fade-in duration-500 font-rubik max-w-6xl mx-auto">
      <div className="mb-8">
        <Link to="/admin/products" className="inline-flex items-center text-sm font-medium text-admin-text hover:text-admin-accent dark:text-admin-text-dark dark:hover:text-admin-accent transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Add New Product</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Fill in the details to add a new product to your catalog.</p>
      </div>

      <ProductForm />
    </div>
  );
};

export default AddProduct;
