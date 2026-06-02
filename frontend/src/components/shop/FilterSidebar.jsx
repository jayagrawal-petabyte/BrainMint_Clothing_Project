import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FilterSidebar.css';

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
  selectedCount = 0,
  onReset
}) => {
  const [isOpen, setIsOpen] =
    useState(defaultOpen);

  return (
    <div className="ltn__menu-widget">
      <div
        className="widget-header"
        onClick={() =>
          setIsOpen(!isOpen)
        }
      >
        <h4 className="ltn__widget-title">
          {title}
        </h4>

        <span className="toggle-icon">
          {isOpen ? (
            <Minus
              size={16}
              strokeWidth={2}
            />
          ) : (
            <Plus
              size={16}
              strokeWidth={2}
            />
          )}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0
            }}
            animate={{
              height: 'auto',
              opacity: 1
            }}
            exit={{
              height: 0,
              opacity: 0
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }}
            style={{
              overflow: 'hidden'
            }}
          >
            <div className="widget-content">
              {selectedCount >
                0 && (
                <div className="filter-selection-info">
                  <span className="selection-count">
                    {selectedCount}{' '}
                    selected
                  </span>

                  <button
                    type="button"
                    className="reset-btn"
                    onClick={e => {
                      e.stopPropagation();
                      onReset?.();
                    }}
                  >
                    Reset
                  </button>
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

const FilterSidebar = ({
  filters = {},
  onFilterChange,
  products = []
}) => {
  const safeFilters = {
    categories:
      filters.categories || [],
    sizes: filters.sizes || [],
    colors: filters.colors || [],
    minPrice:
      filters.minPrice || '',
    maxPrice:
      filters.maxPrice || ''
  };

  const toggleArrayFilter = (
    type,
    value
  ) => {
    const current =
      safeFilters[type] || [];

    const updated =
      current.includes(value)
        ? current.filter(
            item => item !== value
          )
        : [...current, value];

    onFilterChange({
      ...safeFilters,
      [type]: updated
    });
  };

  const handlePriceChange = (
    e,
    field
  ) => {
    onFilterChange({
      ...safeFilters,
      [field]: e.target.value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      sizes: [],
      colors: [],
      minPrice: '',
      maxPrice: ''
    });
  };

  const categories = [
    'Dress',
    'Top',
    'Blouse',
    'Skirt',
    'Trouser',
    'Coat',
    'Blazer'
  ];

  const colors = [
    {
      name: 'Black',
      hex: '#000000'
    },
    {
      name: 'White',
      hex: '#FFFFFF'
    },
    {
      name: 'Pink',
      hex: '#FFB6C1'
    },
    {
      name: 'Beige',
      hex: '#F5F5DC'
    },
    {
      name: 'Blue',
      hex: '#1e73be'
    },
    {
      name: 'Red',
      hex: '#c8232c'
    },
    {
      name: 'Grey',
      hex: '#808080'
    }
  ];

  const getActiveFilters =
    () => {
      let active = [];

      safeFilters.categories?.forEach(
        c => {
          active.push({
            label: `${c}s`,
            type:
              'categories',
            value: c
          });
        }
      );

      safeFilters.sizes?.forEach(
        s => {
          active.push({
            label: `Size: ${s}`,
            type: 'sizes',
            value: s
          });
        }
      );

      safeFilters.colors?.forEach(
        c => {
          const colorObj =
            colors.find(
              col =>
                col.hex === c
            );

          active.push({
            label: colorObj
              ? colorObj.name
              : c,
            type:
              'colors',
            value: c
          });
        }
      );

      if (
        safeFilters.minPrice !==
          '' ||
        safeFilters.maxPrice !== ''
      ) {
        active.push({
          label: `₹${
            safeFilters.minPrice ||
            0
          } - ₹${
            safeFilters.maxPrice ||
            'Any'
          }`,
          type: 'price'
        });
      }

      return active;
    };

  const activeFilters =
    getActiveFilters();

  return (
    <div className="ltn__sidebar-filter">
      {activeFilters.length >
        0 && (
        <div className="active-filters-container">
          <div className="active-filters-list">
            {activeFilters.map(
              (
                filter,
                index
              ) => (
                <span
                  key={index}
                  className="active-filter-tag"
                >
                  {filter.label}

                  <button
                    type="button"
                    onClick={() =>
                      filter.type ===
                      'price'
                        ? onFilterChange(
                            {
                              ...safeFilters,
                              minPrice:
                                '',
                              maxPrice:
                                ''
                            }
                          )
                        : toggleArrayFilter(
                            filter.type,
                            filter.value
                          )
                    }
                  >
                    &times;
                  </button>
                </span>
              )
            )}
          </div>

          <button
            type="button"
            className="clear-all-btn"
            onClick={
              clearAllFilters
            }
          >
            Clear All
          </button>
        </div>
      )}

      {/* Categories */}
      <FilterSection
        title="Categories"
        selectedCount={
          safeFilters
            .categories.length
        }
        onReset={() =>
          onFilterChange({
            ...safeFilters,
            categories: []
          })
        }
      >
        <ul className="menu-list">
          {categories.map(cat => {
            const count =
              products.filter(
                p =>
                  p?.name
                    ?.toLowerCase()
                    .includes(
                      cat.toLowerCase()
                    )
              ).length;

            return (
              <li key={cat}>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={safeFilters.categories.includes(
                      cat
                    )}
                    onChange={() =>
                      toggleArrayFilter(
                        'categories',
                        cat
                      )
                    }
                  />

                  <span className="filter-name">
                    {cat}s
                  </span>

                  <span className="filter-count">
                    ({count})
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {/* Size */}
      <FilterSection 
        title="Size"
        selectedCount={safeFilters.sizes.length}
        onReset={() => onFilterChange({ ...safeFilters, sizes: [] })}
      >
        <ul className="menu-list size-list">
          {['S', 'M', 'L', 'XL', '30', '32', '34', '36'].map(size => (
            <li key={size}>
              <button
                type="button"
                className={`size-pill ${safeFilters.sizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggleArrayFilter('sizes', size)}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Color */}
      <FilterSection 
        title="Color"
        selectedCount={safeFilters.colors.length}
        onReset={() => onFilterChange({ ...safeFilters, colors: [] })}
      >
        <ul className="menu-list color-list">
          {colors.map(color => {
            const count = products.filter(p => p.colors && p.colors.includes(color.hex)).length;
            return (
              <li key={color.name}>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={safeFilters.colors.includes(color.hex)}
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

      {/* Price */}
      <FilterSection
        title="Price"
      >
        <div className="price-filter">
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={
                safeFilters.minPrice
              }
              onChange={e =>
                handlePriceChange(
                  e,
                  'minPrice'
                )
              }
            />

            <input
              type="number"
              placeholder="Max"
              value={
                safeFilters.maxPrice
              }
              onChange={e =>
                handlePriceChange(
                  e,
                  'maxPrice'
                )
              }
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
