import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
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
      {isOpen && (
        <div className="widget-content">
          {children}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = () => {
  return (
    <div className="ltn__sidebar-filter">

      {/* Categories */}
      <FilterSection title="Categories">
        <ul className="menu-list">
          <li><a href="#" onClick={e => e.preventDefault()}>T-Shirts <span className="count">(2)</span></a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>Shirts <span className="count">(2)</span></a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>Jeans <span className="count">(2)</span></a></li>
        </ul>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="price-filter">
          <div className="price-inputs">
            <div className="price-field">
              <span className="price-label">$</span>
              <input
                type="number"
                placeholder="0"
                min="0"
                className="price-input"
              />
            </div>
            <span className="price-separator">—</span>
            <div className="price-field">
              <span className="price-label">$</span>
              <input
                type="number"
                placeholder="100"
                min="0"
                className="price-input"
              />
            </div>
          </div>
          <button className="price-filter-btn" onClick={e => e.preventDefault()}>Filter</button>
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <ul className="menu-list size-list">
          <li><a href="#" onClick={e => e.preventDefault()}>S</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>M</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>L</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>XL</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>30</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>32</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>34</a></li>
          <li><a href="#" onClick={e => e.preventDefault()}>36</a></li>
        </ul>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <ul className="menu-list color-list">
          <li>
            <label className="color-checkbox">
              <input type="checkbox" />
              <span className="color-swatch" style={{backgroundColor: '#000'}}></span>
              Black
            </label>
          </li>
          <li>
            <label className="color-checkbox">
              <input type="checkbox" />
              <span className="color-swatch" style={{backgroundColor: '#fff', border: '1px solid #ddd'}}></span>
              White
            </label>
          </li>
          <li>
            <label className="color-checkbox">
              <input type="checkbox" />
              <span className="color-swatch" style={{backgroundColor: '#1e73be'}}></span>
              Blue
            </label>
          </li>
          <li>
            <label className="color-checkbox">
              <input type="checkbox" />
              <span className="color-swatch" style={{backgroundColor: '#c8232c'}}></span>
              Red
            </label>
          </li>
        </ul>
      </FilterSection>

    </div>
  );
};

export default FilterSidebar;
