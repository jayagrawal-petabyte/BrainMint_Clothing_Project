import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Shop from './pages/shop/Shop';
import Home from './pages/core/Home';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Wishlist from './pages/shop/Wishlist';
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Account = lazy(() => import('./pages/auth/Account'));
import About from './pages/core/About';
import Returns from './pages/info/Returns';
import Terms from './pages/info/Terms';
import FAQ from './pages/info/FAQ';
import NotFound from './pages/core/NotFound';
import Navbar from './components/layout/Navbar';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';
import BottomMobileNav from './components/layout/BottomMobileNav';

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
import ProtectedRoute from './components/admin/ProtectedRoute';
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));

const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const DiscountManagement = lazy(() => import('./pages/admin/DiscountManagement'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages'));

// Simple loading spinner for suspense fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
  </div>
);

import ScrollToTop from './components/ui/ScrollToTop';
import ScrollToTopRoute from './components/ui/ScrollToTopRoute';
import Contact from "./pages/core/Contact";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Clean page transition wrapper using standard easings and vertical curtain wipe
const PageTransition = ({ children, noCurtain }) => (
  <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
    {/* Sleek luxury curtain panel that slides up on mount */}
    {!noCurtain && (
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.65, ease: [0.85, 0, 0.15, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--ltn__primary-color)",
          zIndex: 99999,
          pointerEvents: "none"
        }}
      />
    )}
    
    {/* Page content fade & slide */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, delay: noCurtain ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </div>
);

function App() {
  const [isHomeSplashActive, setIsHomeSplashActive] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Router>
          <ScrollToTopRoute />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Secure checkout — no Navbar or Footer */}
              <Route path="/checkout" element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <Checkout />
                  </PageTransition>
                </Suspense>
              } />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="discounts" element={<DiscountManagement />} />
                <Route path="messages" element={<ContactMessages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* All other pages get the standard layout */}
            {/* <Route path="*" element={
              <div className="app">
                <AnnouncementBar />
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/search" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <BottomMobileNav />
                <ScrollToTop />
              </div>
            } /> */}
                          {/* All other pages get the standard layout */}
              <Route path="*" element={
                <div className="app">
                  {!isHomeSplashActive && <AnnouncementBar />}
                  {!isHomeSplashActive && <Navbar />}

                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PageTransition noCurtain={true}>
                          <Home onSplashActive={setIsHomeSplashActive} />
                        </PageTransition>
                      }
                    />

                    <Route path="/shop" element={<Shop />} />
                    <Route path="/search" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />

                    <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
                    <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
                    <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
                    <Route path="/reset-password/:token" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
                    <Route path="/account" element={<Suspense fallback={<PageLoader />}><Account /></Suspense>} />
                    
                    <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* <Route path="/returns" element={<Returns />} /> */}
                    {/* <Route path="/terms" element={<Terms />} /> */}
                    <Route path="/faq" element={<FAQ />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  {!isHomeSplashActive && <Footer />}
                  {!isHomeSplashActive && <BottomMobileNav />}
                  {!isHomeSplashActive && <ScrollToTop />}
                </div>
              } />
            </Routes>
          </AnimatePresence>
          {/* </Routes> */}
        </Router>
      </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;

