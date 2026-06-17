import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Heart, Star, Maximize2, X } from 'lucide-react';
import { fetchProductById, fetchProducts, fetchPopularProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductTabs from '../../components/product/ProductTabs';
import AddToCartPopup from '../../components/product/AddToCartPopup';
import SizeGuideModal from '../../components/product/SizeGuideModal';
import ProductSlider from '../../components/product/ProductSlider';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const loadProduct = async () => {
    try {
      setLoading(true);

      const data = await fetchProductById(id);

      if (!data) {
        setProduct(null);
        return;
      }

      setProduct(data);

      setSelectedImage(
        data.images?.[0]?.url ||
          'https://placehold.co/600x800'
      );

      if (data.category) {
        const similarRes = await fetchProducts(`?category=${data.category}`);
        const filteredSimilar = (similarRes.products || []).filter(p => (p._id || p.id) !== data._id && (p._id || p.id) !== data.id);
        setSimilarProducts(filteredSimilar);
      }

      const popular = await fetchPopularProducts();
      const filteredPopular = popular.filter(p => (p._id || p.id) !== data._id && (p._id || p.id) !== data.id);
      setPopularProducts(filteredPopular);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '100px 0' }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <button
          onClick={() => navigate('/shop')}
          className="btn-primary"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const productId =
    product._id || product.id;

  const currentPrice =
    product.discountPrice ||
    product.price ||
    0;

  const originalPrice =
    product.price || 0;

  const discount =
    product.discountPrice &&
    product.discountPrice < product.price
      ? Math.round(
          ((product.price -
            product.discountPrice) /
            product.price) *
            100
        )
      : 0;

  const wishlisted =
    isWishlisted(productId);

  const handleQuantityChange = (
    type
  ) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    }

    if (
      type === 'dec' &&
      quantity > 1
    ) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, quantity, selectedSize, selectedColor);
    setShowPopup(true);
  };

  return (
    <div className="product-detail-page">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsZoomed(false);
              setZoomLevel(1);
            }}
            onWheel={(e) => {
              e.preventDefault();
              setZoomLevel(prev => {
                const newZoom = prev - e.deltaY * 0.005;
                return Math.min(Math.max(1, newZoom), 5); // Clamp between 1x and 5x
              });
            }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Controls Container */}
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                gap: '15px',
                zIndex: 10000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 5))}
                title="Zoom In"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <Plus size={24} />
              </button>
              
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                title="Zoom Out"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <Minus size={24} />
              </button>

              <button 
                onClick={() => {
                  setIsZoomed(false);
                  setZoomLevel(1);
                }}
                title="Close"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                  marginLeft: '10px'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X size={24} />
              </button>
            </div>

            <motion.div
              drag={zoomLevel > 1}
              dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
              dragElastic={0.1}
              style={{
                cursor: zoomLevel > 1 ? 'grab' : 'default',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
              whileTap={{ cursor: zoomLevel > 1 ? 'grabbing' : 'default' }}
            >
              <motion.img
                src={selectedImage}
                alt={product.name}
                initial={{ scale: 0.9 }}
                animate={{ scale: zoomLevel }}
                exit={{ scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="product-detail-container">
        {/* LEFT IMAGE */}
        <div className="product-gallery">
          <div className="main-image-container">
            <button className="expand-btn" onClick={() => setIsZoomed(true)} aria-label="Zoom image">
              <Maximize2 size={20} />
            </button>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                className="main-image"
                onClick={() => setIsZoomed(true)}
                style={{ cursor: 'zoom-in' }}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                exit={{
                  opacity: 0
                }}
                transition={{
                  duration: 0.3
                }}
              />
            </AnimatePresence>
          </div>

          {product.images?.length >
            1 && (
            <div className="thumbnail-strip">
              {product.images.map(
                (img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage ===
                      img.url
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedImage(
                        img.url
                      )
                    }
                  >
                    <img
                      src={img.url}
                      alt={
                        img.alt ||
                        `${product.name} ${index + 1}`
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* RIGHT INFO */}
        <div className="product-detail-info">
          <h2 className="product-detail-title">
            {product.name}
          </h2>

          {/* Rating */}
          <p
            style={{
              marginBottom:
                '10px',
              color: '#777',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Star size={16} fill="#f5a623" stroke="#f5a623" />
            {product.rating || 0}{' '}
            (
            {product.reviewCount || 0}{' '}
            reviews)
          </p>

          {/* Price */}
          <div className="product-price-row">
            <span className="current-price">
              ₹
              {currentPrice.toLocaleString(
                'en-IN'
              )}
            </span>

            {product.discountPrice && (
              <>
                <span className="original-price">
                  ₹
                  {originalPrice.toLocaleString(
                    'en-IN'
                  )}
                </span>

                <span className="discount-badge">
                  Save -
                  {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="product-description">
            {product.description ||
              'No description available.'}
          </p>

          <hr className="divider" />

          {/* Product Meta */}
          <table className="product-meta-table">
            <tbody>
              <tr>
                <td className="meta-label">
                  SKU:
                </td>

                <td className="meta-value">
                  {product
                    .inventory
                    ?.sku ||
                    'N/A'}
                </td>
              </tr>

              <tr>
                <td className="meta-label">
                  Availability:
                </td>

                <td className="meta-value stock-status">
                  {product
                    .inventory
                    ?.stock > 0
                    ? `${product.inventory.stock} left in stock`
                    : 'Out of stock'}
                </td>
              </tr>

              <tr>
                <td className="meta-label">
                  Brand:
                </td>

                <td className="meta-value">
                  {product.brand ||
                    'Princess Size Plus Collection'}
                </td>
              </tr>
            </tbody>
          </table>

          <hr className="divider" />

          {/* Selectors */}
          {(product.sizes?.length > 0 || product.colors?.length > 0) && (
            <div className="product-selectors" style={{ marginBottom: '20px' }}>
              {product.sizes?.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 600, marginRight: '10px' }}>Size:</span>
                      {sizeError && <span style={{ color: '#d11a2a', fontSize: '13px', fontWeight: 500 }}>Please select a size</span>}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowSizeGuide(true)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        fontSize: '13px', 
                        textDecoration: 'underline', 
                        color: 'var(--ltn__paragraph-color)', 
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontFamily: 'var(--ltn__body-font)'
                      }}
                    >
                      Size Guide
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        style={{
                          minWidth: '40px', height: '40px', padding: '0 10px',
                          border: `2px solid ${selectedSize === size ? 'var(--ltn__secondary-color)' : 'var(--border-color-11)'}`,
                          backgroundColor: selectedSize === size ? 'var(--ltn__secondary-color)' : 'transparent',
                          color: selectedSize === size ? 'var(--white-7)' : 'var(--ltn__heading-color)',
                          cursor: 'pointer', transition: 'all 0.3s'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Color:</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          backgroundColor: color, cursor: 'pointer',
                          border: selectedColor === color ? '2px solid var(--ltn__secondary-color)' : '1px solid #ccc',
                          boxShadow: selectedColor === color ? '0 0 0 2px #fff inset' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <hr className="divider" />

          {/* Cart Actions */}
          <div className="cart-actions-row">
            <div className="quantity-selector">
              <button
                onClick={() =>
                  handleQuantityChange(
                    'dec'
                  )
                }
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                value={quantity}
                readOnly
              />

              <button
                onClick={() =>
                  handleQuantityChange(
                    'inc'
                  )
                }
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              className={`add-to-cart-btn ${
                showPopup
                  ? 'added'
                  : ''
              }`}
              onClick={handleAddToCart}
              disabled={product?.inventory?.stock === 0}
            >
              {product?.inventory?.stock === 0
                ? 'Out of Stock'
                : showPopup
                ? 'Added!'
                : 'Add to Cart'}
            </button>
          </div>

          {/* Wishlist */}
          <div className="extra-actions">
            <button
              className={`action-link ${
                wishlisted
                  ? 'wishlisted'
                  : ''
              }`}
              onClick={() =>
                toggleWishlist(
                  product
                )
              }
            >
              <Heart
                size={16}
                fill={
                  wishlisted
                    ? 'currentColor'
                    : 'none'
                }
              />

              {wishlisted
                ? 'Wishlisted'
                : 'Add to Wishlist'}
            </button>
          </div>

          <hr className="divider" />

          {/* Safe Checkout */}
          <div className="safe-checkout">
            <span className="safe-label">
              Guaranteed Safe Checkout
            </span>

            <div className="payment-icons">
              <div className="pay-icon">
                Amazon
              </div>

              <div className="pay-icon">
                Apple Pay
              </div>

              <div className="pay-icon">
                G Pay
              </div>

              <div className="pay-icon">
                PayPal
              </div>

              <div className="pay-icon">
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs 
        productId={product._id || product.id} 
        onReviewAdded={() => loadProduct()} 
      />

      {similarProducts.length > 0 && (
        <ProductSlider title="Similar Products" products={similarProducts} />
      )}
      
      {popularProducts.length > 0 && (
        <ProductSlider title="You May Also Like" products={popularProducts} />
      )}

      <AnimatePresence>
        {showPopup && (
          <AddToCartPopup
            product={product}
            quantity={quantity}
            onClose={() => setShowPopup(false)}
          />
        )}
        {showSizeGuide && (
          <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="mobile-sticky-atc d-lg-none">
        <div className="sticky-atc-variants">
          <span>
            {selectedSize && `${selectedSize} / `}
            {selectedColor && `${selectedColor} / `}
            {product.brand || 'Princess Size Plus Collection'} - ₹{currentPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="sticky-atc-actions">
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange('dec')}><Minus size={16} /></button>
            <input type="number" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange('inc')}><Plus size={16} /></button>
          </div>
          <button className={`add-to-cart-btn ${showPopup ? 'added' : ''}`} onClick={handleAddToCart}>
            {showPopup ? 'Added!' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
