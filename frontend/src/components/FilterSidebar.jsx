import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FilterSidebar.css';

const FilterSection = ({ title, children, defaultOpen = true }) => {
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
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSidebar = ({ filters, onFilterChange }) => {
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

  return (
    <div className="ltn__sidebar-filter">

      {/* Categories */}
      <FilterSection title="Categories">
        <ul className="menu-list">
          {['Dress', 'Top', 'Blouse', 'Skirt', 'Trouser', 'Coat', 'Blazer'].map(cat => (
            <li key={cat}>
              <button
                type="button"
                className={`filter-btn ${filters.categories.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleArrayFilter('categories', cat)}
                style={{ fontWeight: filters.categories.includes(cat) ? 'bold' : 'normal' }}
              >
                {cat}s
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
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

      {/* Size */}
      <FilterSection title="Size">
        <ul className="menu-list size-list">
          {['XS', 'S', 'M', 'L', 'XL'].map(size => (
            <li key={size}>
              <button
                type="button"
                className={`size-pill ${filters.sizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggleArrayFilter('sizes', size)}
                style={{
                  backgroundColor: filters.sizes.includes(size) ? '#111' : '#f7f7f7',
                  color: filters.sizes.includes(size) ? '#fff' : '#111'
                }}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <ul className="menu-list color-list">
          {[
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Pink', hex: '#FFB6C1' },
            { name: 'Beige', hex: '#F5F5DC' },
            { name: 'Blue', hex: '#1e73be' },
            { name: 'Red', hex: '#c8232c' },
            { name: 'Grey', hex: '#808080' }
          ].map(color => (
            <li key={color.name}>
              <label className="color-checkbox">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color.hex)}
                  onChange={() => toggleArrayFilter('colors', color.hex)}
                />
                <span className="color-swatch" style={{
                  backgroundColor: color.hex,
                  border: color.name === 'White' || color.name === 'Beige' ? '1px solid #ddd' : 'none'
                }}></span>
                {color.name}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

    </div>
  );
};

export default FilterSidebar;
