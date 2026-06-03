import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await fetchCategories();
    setCategories(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const categoryData = { name: name.trim() };

    if (isEditing && currentId) {
      await adminUpdateCategory(currentId, categoryData, token);
    } else {
      await adminCreateCategory(categoryData, token);
    }

    setName('');
    setIsEditing(false);
    setCurrentId(null);
    setIsSubmitting(false);
    loadCategories();
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentId(category._id);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    const token = localStorage.getItem('adminToken');
    await adminDeleteCategory(id, token);
    loadCategories();
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 font-rubik">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-montserrat text-admin-heading dark:text-admin-heading-dark">Category Management</h1>
        <p className="text-admin-text dark:text-admin-text-dark mt-1">Add, edit, and organize product categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden">
            <div className="p-6 border-b border-admin-border dark:border-admin-border-dark bg-admin-bg/30 dark:bg-[#1A1A1A]/30">
              <h2 className="text-lg font-semibold text-admin-heading dark:text-admin-heading-dark flex items-center gap-2">
                {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-admin-text dark:text-admin-text-dark mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark rounded-xl focus:outline-none focus:border-admin-accent transition-colors text-admin-heading dark:text-admin-heading-dark"
                    placeholder="e.g., Summer Collection"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1 bg-admin-accent hover:bg-admin-accent-hover text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Add Category')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setCurrentId(null);
                        setName('');
                      }}
                      className="px-4 py-2.5 border border-admin-border dark:border-admin-border-dark rounded-xl text-admin-text dark:text-admin-text-dark hover:bg-admin-bg dark:hover:bg-[#1A1A1A] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-admin-card dark:bg-admin-card-dark rounded-2xl shadow-sm border border-admin-border dark:border-admin-border-dark overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            <div className="p-4 border-b border-admin-border dark:border-admin-border-dark">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-admin-text dark:text-admin-text-dark" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-admin-bg dark:bg-[#1A1A1A] border border-admin-border dark:border-admin-border-dark focus:border-admin-accent rounded-xl outline-none text-admin-heading dark:text-admin-heading-dark transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-admin-bg/50 dark:bg-[#1A1A1A]/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-admin-text dark:text-admin-text-dark uppercase tracking-wider border-b border-admin-border dark:border-admin-border-dark">Category Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-admin-text dark:text-admin-text-dark uppercase tracking-wider border-b border-admin-border dark:border-admin-border-dark w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border dark:divide-admin-border-dark">
                  {isLoading ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-4 h-4 border-2 border-admin-accent border-t-transparent rounded-full animate-spin"></div>
                          Loading categories...
                        </div>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-8 text-center text-admin-text dark:text-admin-text-dark">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-admin-bg/30 dark:hover:bg-[#1A1A1A]/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-admin-heading dark:text-admin-heading-dark">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
