import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Shop from './pages/shop/Shop';
import Home from './pages/core/Home';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Wishlist from './pages/shop/Wishlist';
import Checkout from './pages/shop/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Account from './pages/auth/Account';
import About from './pages/core/About';
import Returns from './pages/info/Returns';
import Terms from './pages/info/Terms';
import NotFound from './pages/core/NotFound';
import Navbar from './components/layout/Navbar';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';
import BottomMobileNav from './components/layout/BottomMobileNav';

import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import ProductManagement from './pages/admin/ProductManagement';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';

import CategoryManagement from './pages/admin/CategoryManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import DiscountManagement from './pages/admin/DiscountManagement';
import ContactMessages from './pages/admin/ContactMessages';

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
                <PageTransition>
                  <Checkout />
                </PageTransition>
              } />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
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

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/account" element={<Account />} />
                    
                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* <Route path="/returns" element={<Returns />} /> */}
                    <Route path="/terms" element={<Terms />} />

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

