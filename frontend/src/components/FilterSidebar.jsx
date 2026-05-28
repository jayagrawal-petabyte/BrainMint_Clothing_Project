import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FilterSidebar.css';

const FilterSection = ({ title, children, defaultOpen = true, selectedCount = 0, onReset }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="ltn__menu-widget">
      <div className="widget-header" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="ltn__widget-title">{title}</h4>
        <span className="toggle-icon">
          {isOpen ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="widget-content">
              {selectedCount > 0 && (
                <div className="filter-selection-info">
                  <span className="selection-count">{selectedCount} selected</span>
                  <button type="button" className="reset-btn" onClick={(e) => { e.stopPropagation(); onReset(); }}>Reset</button>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSidebar = ({ filters, onFilterChange, products = [] }) => {
  const toggleArrayFilter = (type, value) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFilterChange({ ...filters, [type]: updated });
  };

  const handlePriceChange = (e, field) => {
    onFilterChange({ ...filters, [field]: e.target.value });
  };

  const clearAllFilters = () => {
    onFilterChange({ categories: [], sizes: [], colors: [], minPrice: '', maxPrice: '' });
  };

  const categories = ['Dress', 'Top', 'Blouse', 'Skirt', 'Trouser', 'Coat', 'Blazer'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Pink', hex: '#FFB6C1' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Blue', hex: '#1e73be' },
    { name: 'Red', hex: '#c8232c' },
    { name: 'Grey', hex: '#808080' }
  ];

  const getActiveFilters = () => {
    let active = [];
    filters.categories.forEach(c => active.push({ label: `${c}s`, type: 'categories', value: c }));
    filters.sizes.forEach(s => active.push({ label: `Size: ${s}`, type: 'sizes', value: s }));
    filters.colors.forEach(c => {
      const colorObj = colors.find(col => col.hex === c);
      active.push({ label: colorObj ? colorObj.name : c, type: 'colors', value: c });
    });
    if (filters.minPrice !== '' || filters.maxPrice !== '') {
      active.push({ label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || 'Any'}`, type: 'price' });
    }
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="ltn__sidebar-filter">

      {activeFilters.length > 0 && (
        <div className="active-filters-container">
          <div className="active-filters-list">
            {activeFilters.map((filter, index) => (
              <span key={index} className="active-filter-tag">
                {filter.label}
                <button type="button" onClick={() => filter.type === 'price' ? onFilterChange({ ...filters, minPrice: '', maxPrice: '' }) : toggleArrayFilter(filter.type, filter.value)}>
                  &times;
                </button>
              </span>
            ))}
          </div>
          <button type="button" className="clear-all-btn" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      <FilterSection 
        title="Categories" 
        selectedCount={filters.categories.length}
        onReset={() => onFilterChange({ ...filters, categories: [] })}
      >
        <ul className="menu-list">
          {categories.map(cat => {
            const count = products.filter(p => p.name.toLowerCase().includes(cat.toLowerCase())).length;
            return (
              <li key={cat}>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleArrayFilter('categories', cat)}
                  />
                  <span className="filter-name">{cat}s</span>
                  <span className="filter-count">({count})</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      <FilterSection 
        title="Price"
        selectedCount={(filters.minPrice !== '' || filters.maxPrice !== '') ? 1 : 0}
        onReset={() => onFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
      >
        <div className="price-filter">
          <div className="price-inputs">
            <div className="price-field">
              <span className="price-label">₹</span>
              <input
                type="number"
                placeholder="Min"
                min="0"
                className="price-input"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange(e, 'minPrice')}
              />
            </div>
            <span className="price-separator">—</span>
            <div className="price-field">
              <span className="price-label">₹</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                className="price-input"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange(e, 'maxPrice')}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection 
        title="Size"
        selectedCount={filters.sizes.length}
        onReset={() => onFilterChange({ ...filters, sizes: [] })}
      >
        <ul className="menu-list size-list">
          {['XS', 'S', 'M', 'L', 'XL'].map(size => (
            <li key={size}>
              <button
                type="button"
                className={`size-pill ${filters.sizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggleArrayFilter('sizes', size)}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection 
        title="Color"
        selectedCount={filters.colors.length}
        onReset={() => onFilterChange({ ...filters, colors: [] })}
      >
        <ul className="menu-list color-list">
          {colors.map(color => {
            const count = products.filter(p => p.colors && p.colors.includes(color.hex)).length;
            return (
              <li key={color.name}>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.hex)}
                    onChange={() => toggleArrayFilter('colors', color.hex)}
                  />
                  <span className="color-swatch" style={{
                    backgroundColor: color.hex,
                    border: color.name === 'White' || color.name === 'Beige' ? '1px solid var(--border-color-1)' : 'none'
                  }}></span>
                  <span className="filter-name">{color.name}</span>
                  <span className="filter-count">({count})</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterSection>

    </div>
  );
};

export default FilterSidebar;
