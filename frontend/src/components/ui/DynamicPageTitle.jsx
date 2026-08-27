import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BRAND_SUFFIX = 'Princess Size+ Collection';

const ROUTE_TITLES = {
  '/': 'Women Collection',
  '/shop': 'Shop',
  '/search': 'Search',
  '/cart': 'Shopping Cart',
  '/wishlist': 'Wishlist',
  '/checkout': 'Checkout',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
  '/account': 'My Account',
  '/about': 'About Us',
  '/contact': 'Contact Us',
  '/faq': 'FAQ',
  '/returns': 'Returns & Exchanges',
  '/terms': 'Terms of Service',
  '/admin/login': 'Admin Login',
  '/admin': 'Admin Dashboard',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/products': 'Product Management',
  '/admin/products/add': 'Add New Product',
  '/admin/categories': 'Category Management',
  '/admin/inventory': 'Inventory Management',
  '/admin/orders': 'Order Management',
  '/admin/discounts': 'Discount Management',
  '/admin/messages': 'Customer Messages',
  '/admin/settings': 'Settings'
};

const DynamicPageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exact match in route table
    if (ROUTE_TITLES[pathname]) {
      document.title = `${ROUTE_TITLES[pathname]} | ${BRAND_SUFFIX}`;
      return;
    }

    // Dynamic parameterized routes
    if (pathname.startsWith('/product/')) {
      // Temporary fallback until ProductDetail loads specific product name
      document.title = `Product Details | ${BRAND_SUFFIX}`;
    } else if (pathname.startsWith('/admin/products/edit/')) {
      document.title = `Edit Product | ${BRAND_SUFFIX}`;
    } else if (pathname.startsWith('/reset-password/')) {
      document.title = `Reset Password | ${BRAND_SUFFIX}`;
    } else {
      document.title = `Page Not Found | ${BRAND_SUFFIX}`;
    }
  }, [pathname]);

  return null;
};

export default DynamicPageTitle;
