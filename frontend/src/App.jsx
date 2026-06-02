import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './pages/Shop';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import About from './pages/About';
import Returns from './pages/Returns';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';


import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';

import InventoryManagement from './pages/admin/InventoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import DiscountManagement from './pages/admin/DiscountManagement';
import SalesAnalytics from './pages/admin/SalesAnalytics';

import ScrollToTop from './components/ScrollToTop';
import ScrollToTopRoute from './components/ScrollToTopRoute';
import Contact from "./pages/Contact";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Router>
          <ScrollToTopRoute />
          <Routes>
            {/* Secure checkout — no Navbar or Footer */}
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="discounts" element={<DiscountManagement />} />
                <Route path="analytics" element={<SalesAnalytics />} />
              </Route>
            </Route>

            {/* All other pages get the standard layout */}
            <Route path="*" element={
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
                <ScrollToTop />
              </div>
            } />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
