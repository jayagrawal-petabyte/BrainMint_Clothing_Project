// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Minus, Plus, Heart } from 'lucide-react';
// // import { mockProducts } from '../data/products';
// import { fetchProductById } from '../services/api';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext';
// import ProductCard from '../components/ProductCard';
// import ProductTabs from '../components/ProductTabs';
// import SizeGuideModal from '../components/SizeGuideModal';
// import './ProductDetail.css';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [showSizeGuide, setShowSizeGuide] = useState(false);
//   const [cartAdded, setCartAdded] = useState(false);

//   useEffect(() => {
//   const loadProduct = async () => {
//     const data = await fetchProductById(id);

//     setProduct(data);
//     setLoading(false);
//   };

//   loadProduct();
// }, [id]);
//   useEffect(() => {
//     if (product) {
//       setSelectedImage(
//   product.images?.[0]?.url
// );
//       setQuantity(1);
//       setCartAdded(false);
//       if (product.sizes && product.sizes.length > 0) {
//         setSelectedSize(product.sizes[0]);
//       }
//       if (product.colors && product.colors.length > 0) {
//         setSelectedColor(product.colors[0]);
//       }
//     }
//   }, [product]);
//   if (loading) {
//   return <h2>Loading...</h2>;
// }
//   if (!product) {
//     return (
//       <div className="product-not-found">
//         <h2>Product not found</h2>
//         <button onClick={() => navigate('/shop')} className="btn-primary">Return to Shop</button>
//       </div>
//     );
//   }

//   const handleQuantityChange = (type) => {
//     if (type === 'inc') {
//       setQuantity(prev => prev + 1);
//     } else if (type === 'dec' && quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const handleAddToCart = () => {
//     addToCart({ ...product, selectedSize, selectedColor }, quantity);
//     setCartAdded(true);
//     setTimeout(() => setCartAdded(false), 2000);
//   };

//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0;

//   const wishlisted = isWishlisted(product.id);

//   const relatedProducts = mockProducts
//     .filter(p => p.category === product.category && p.id !== product.id)
//     .slice(0, 4);

//   return (
//     <div className="product-detail-page">
//       {/* Top Banner (Breadcrumb) */}
//       <div className="product-detail-header">
//         <h1 className="page-title">Product</h1>
//         <div className="breadcrumb">
//           <Link to="/">Home</Link>
//           <span className="separator">{'>'}</span>
//           <Link to="/shop">Shop</Link>
//           <span className="separator">{'>'}</span>
//           <span className="current">{product.name}</span>
//         </div>
//       </div>

//       <div className="product-detail-container">

//         {/* Left: Image Gallery */}
//         <div className="product-gallery">
//           <div className="main-image-container">
//             <AnimatePresence mode="wait">
//               <motion.img
//                 key={selectedImage}
//                 src={selectedImage}
//                 alt={product.name}
//                 className="main-image"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               />
//             </AnimatePresence>
//             <button className="expand-btn">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
//               </svg>
//             </button>
//           </div>

//           {product.images.length > 1 && (
//             <div className="thumbnail-strip">
//               {product.images.map((img, index) => (
//                 <div
//                   key={index}
//                   className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
//                   onClick={() => setSelectedImage(img)}
//                 >
//                   <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right: Product Info */}
//         <div className="product-detail-info">
//           <h2 className="product-detail-title">{product.name}</h2>

//           <div className="product-price-row">
//             <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
//             {product.originalPrice && (
//               <>
//                 <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
//                 <span className="discount-badge">Save -{discount}%</span>
//               </>
//             )}
//           </div>

//           <p className="product-description">
//             Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
//           </p>

//           <hr className="divider" />

//           <table className="product-meta-table">
//             <tbody>
//               <tr>
//                 <td className="meta-label">SKU:</td>
//                 <td className="meta-value">1510</td>
//               </tr>
//               <tr>
//                 <td className="meta-label">Availability:</td>
//                 <td className="meta-value stock-status">10 left in stock</td>
//               </tr>
//               <tr>
//                 <td className="meta-label">Vendor:</td>
//                 <td className="meta-value">Vendor A</td>
//               </tr>
//               <tr>
//                 <td className="meta-label">Type:</td>
//                 <td className="meta-value">Type A</td>
//               </tr>
//             </tbody>
//           </table>

//           <hr className="divider" />

//           {/* Size selector + Size Guide link */}
//           {product.sizes && (
//             <div className="selector-group">
//               <span className="selector-label">Size :</span>
//               <div className="size-selector">
//                 {product.sizes.map(size => (
//                   <button
//                     key={size}
//                     className={`size-btn ${selectedSize === size ? 'active' : ''}`}
//                     onClick={() => setSelectedSize(size)}
//                   >
//                     {size}
//                   </button>
//                 ))}
//                 <button className="size-guide-link" onClick={() => setShowSizeGuide(true)}>
//                   Size Guide
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Color selector */}
//           {product.colors && (
//             <div className="selector-group">
//               <span className="selector-label">Color :</span>
//               <div className="color-selector">
//                 {product.colors.map(color => (
//                   <button
//                     key={color}
//                     className={`color-btn ${selectedColor === color ? 'active' : ''}`}
//                     onClick={() => setSelectedColor(color)}
//                     style={{
//                       backgroundColor: color,
//                       border: (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#f5f5dc') ? '1px solid var(--border-color-1)' : 'none'
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           <hr className="divider" />

//           {/* Add to cart row */}
//           <div className="cart-actions-row">
//             <div className="quantity-selector">
//               <button onClick={() => handleQuantityChange('dec')}><Minus size={16} /></button>
//               <input type="number" value={quantity} readOnly />
//               <button onClick={() => handleQuantityChange('inc')}><Plus size={16} /></button>
//             </div>

//             <button
//               className={`add-to-cart-btn ${cartAdded ? 'added' : ''}`}
//               onClick={handleAddToCart}
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
//                 <circle cx="9" cy="21" r="1"></circle>
//                 <circle cx="20" cy="21" r="1"></circle>
//                 <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
//               </svg>
//               {cartAdded ? 'Added!' : 'Add to cart'}
//             </button>

//             <button className="buy-now-btn">Buy it now</button>
//           </div>

//           <div className="extra-actions">
//             <button
//               className={`action-link ${wishlisted ? 'wishlisted' : ''}`}
//               onClick={() => toggleWishlist(product)}
//             >
//               <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
//               {wishlisted ? 'Wishlisted' : 'Add to wishlist'}
//             </button>
//             <button className="action-link">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
//               Compare
//             </button>
//             <button className="action-link">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
//               Ask about this product
//             </button>
//           </div>

//           <hr className="divider" />

//           {/* Social Share */}
//           <div className="social-share">
//             <span className="share-label">Share:</span>
//             <button className="share-btn">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
//               Facebook
//             </button>
//             <button className="share-btn">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
//               Twitter
//             </button>
//             <button className="share-btn">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z" /></svg>
//               Pinterest
//             </button>
//           </div>

//           {/* Safe Checkout */}
//           <div className="safe-checkout">
//             <span className="safe-label">Guaranteed Safe Checkout</span>
//             <div className="payment-icons">
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>Amazon</div>
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>Apple Pay</div>
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>Bitcoin</div>
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>G Pay</div>
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>PayPal</div>
//               <div className="pay-icon" style={{ border: '1px solid #ddd', padding: '2px 8px', borderRadius: '4px' }}>VISA</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Info Tabs */}
//       <ProductTabs />

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="related-products-section">
//           <div className="related-products-heading">
//             <h2>Related Products</h2>
//             <span className="related-heading-dash" />
//           </div>
//           <div className="related-products-grid">
//             {relatedProducts.map(p => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Size Guide Modal */}
//       {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Heart } from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductTabs from '../components/ProductTabs';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await fetchProductById(id);

        console.log('Fetched Product:', data);

        if (!data) {
          setProduct(null);
          return;
        }

        setProduct(data);

        setSelectedImage(
          data.images?.[0]?.url ||
            'https://placehold.co/600x800'
        );
      } catch (error) {
        console.error(
          'Error loading product:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-not-found">
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
    addToCart(product, quantity);

    setCartAdded(true);

    setTimeout(() => {
      setCartAdded(false);
    }, 2000);
  };

  return (
    <div className="product-detail-page">
      {/* HEADER */}
      <div className="product-detail-header">
        <h1 className="page-title">
          Product
        </h1>

        <div className="breadcrumb">
          <Link to="/">Home</Link>

          <span className="separator">
            {'>'}
          </span>

          <Link to="/shop">
            Shop
          </Link>

          <span className="separator">
            {'>'}
          </span>

          <span className="current">
            {product.name}
          </span>
        </div>
      </div>

      <div className="product-detail-container">
        {/* LEFT IMAGE */}
        <div className="product-gallery">
          <div className="main-image-container">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                className="main-image"
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
              color: '#777'
            }}
          >
            ⭐{' '}
            {product.rating
              ?.average || 0}{' '}
            (
            {product.rating
              ?.count || 0}{' '}
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
                    'UrbanWear'}
                </td>
              </tr>
            </tbody>
          </table>

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
                cartAdded
                  ? 'added'
                  : ''
              }`}
              onClick={handleAddToCart}
            >
              {cartAdded
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

      <ProductTabs />
    </div>
  );
};

export default ProductDetail;