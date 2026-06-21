// ─── Backend Service URLs ────────────────────────────────────────────────────
const AUTH_URL = "https://brainmint-clothing-project-combined.onrender.com/api";
const PRODUCTS_URL = "https://brainmint-clothing-project-combined.onrender.com/api";
const CART_URL = "https://brainmint-clothing-project-combined.onrender.com/api";
const COMBINED_URL = "https://brainmint-clothing-project-combined.onrender.com/api";

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchProducts = async (params = "") => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products${params}`);
    const data = await response.json();
    return data.data || { products: [], pagination: { total: 0, pages: 0, page: 1 } };
  } catch (error) {
    return { products: [], pagination: { total: 0, pages: 0, page: 1 } };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
};

export const fetchProductReviews = async (productId) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${productId}/reviews`);
    const data = await response.json();
    return data.data?.reviews || [];
  } catch (error) {
    return [];
  }
};

export const submitProductReview = async (productId, reviewData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      return { success: false, message: `HTTP Error ${response.status}: Failed to parse JSON` };
    }

    if (!response.ok) {
      return { success: false, message: data.message || `HTTP Error ${response.status}` };
    }

    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchNewArrivals = async () => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/new-arrivals`);
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/categories`);
    const data = await response.json();
    return data.data?.categories || [];
  } catch (error) {
    return [];
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = async (phoneNumber, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const forgotPasswordUser = async (email) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const resetPasswordUser = async (token, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const sendRegistrationOtp = async (userData) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/send-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const verifyRegistrationOtp = async (email, otp) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/verify-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const registerUser = async (name, email, phoneNumber, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phoneNumber, password }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchCurrentUser = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (profileData, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUserPassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, message: errorData.message || "Failed to update password" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${AUTH_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const subscribeNewsletter = async (email) => {
  try {
    const response = await fetch(`${AUTH_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const fetchAdminStatus = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/admin`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const adminCreateProduct = async (productData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminUpdateProduct = async (id, productData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminDeleteProduct = async (id, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminCreateCategory = async (categoryData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminUpdateCategory = async (id, categoryData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminDeleteCategory = async (id, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

// --- Admin Coupons ---
export const fetchAdminCoupons = async (token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/admin/coupons`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminCreateCoupon = async (couponData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/admin/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminUpdateCoupon = async (id, couponData, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/admin/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const adminDeleteCoupon = async (id, token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/admin/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchSalesAnalytics = async (token) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/admin/analytics/sales`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

// ─── Cart / Orders ─────────────────────────────────────────────────────────────
export const fetchCart = async (token) => {
  try {
    const response = await fetch(`${CART_URL}/cart`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const syncAddToCart = async (productId, quantity, size, color, token) => {
  try {
    const response = await fetch(`${CART_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity, size, color }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const removeFromCartApi = async (productId, token) => {
  try {
    const response = await fetch(`${CART_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const updateCartQuantityApi = async (productId, quantity, token) => {
  try {
    const response = await fetch(`${CART_URL}/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchWishlist = async (token) => {
  try {
    const response = await fetch(`${CART_URL}/wishlist`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const addToWishlistApi = async (productId, token) => {
  try {
    const response = await fetch(`${CART_URL}/wishlist/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const removeFromWishlistApi = async (productId, token) => {
  try {
    const response = await fetch(`${CART_URL}/wishlist/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const clearWishlistApi = async (token) => {
  try {
    const response = await fetch(`${CART_URL}/wishlist`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const placeOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${CART_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const createPaymentOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${CART_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const verifyPayment = async (paymentData, token) => {
  try {
    const response = await fetch(`${CART_URL}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchMyOrders = async (token) => {
  try {
    const response = await fetch(`${CART_URL}/orders/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchAdminOrders = async (token) => {
  try {
    // Try Person 2's analytics endpoint first (has User model registered)
    const response = await fetch(`${PRODUCTS_URL}/admin/analytics/orders`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data && data.success && Array.isArray(data.data)) {
      return data;
    }
  } catch (error) {
    // Fall through to Person 3
  }

  try {
    // Fallback to Person 3's endpoint
    const response = await fetch(`${CART_URL}/orders/all`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await fetch(`${CART_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const cancelUserOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${CART_URL}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const validateCoupon = async (code) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};

// ─── Trending & Popular ────────────────────────────────────────────────────────
const FALLBACK_TRENDING_SEARCHES = [
  "Summer Dresses",
  "Linen Shirts",
  "Oversized Tees",
  "Denim Jackets",
  "Crop Tops",
  "Wide-Leg Pants",
  "Pleated Skirts",
  "Trench Coats"
];

const FALLBACK_POPULAR_PRODUCTS = [
  {
    _id: "popular-1",
    name: "Luxe Silk Blouse",
    price: 3499,
    discountPrice: 2999,
    images: [
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600" },
      { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600" }
    ],
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#FFFFFF", "#F5F5DC"],
    rating: { average: 4.8, count: 124 },
    isTrending: true
  },
  {
    _id: "popular-2",
    name: "Classic Trench Coat",
    price: 8999,
    discountPrice: 7999,
    images: [
      { url: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=600" }
    ],
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F5F5DC", "#000000"],
    rating: { average: 4.9, count: 86 },
    isTrending: true
  },
  {
    _id: "popular-3",
    name: "Floral Maxi Dress",
    price: 4999,
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" }
    ],
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#FFB6C1", "#FFFFFF"],
    rating: { average: 4.7, count: 95 },
    isTrending: true
  },
  {
    _id: "popular-4",
    name: "Oversized Denim Jacket",
    price: 5499,
    discountPrice: 4499,
    images: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600" }
    ],
    category: "women",
    sizes: ["S", "M", "L"],
    colors: ["#1e73be"],
    rating: { average: 4.6, count: 54 },
    isTrending: true
  },
  {
    _id: "popular-5",
    name: "High-Waist Tailored Trousers",
    price: 3999,
    images: [
      { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600" }
    ],
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#000000", "#808080"],
    rating: { average: 4.5, count: 42 },
    isTrending: true
  }
];

// Cache promises for endpoints to prevent redundant parallel requests
let searchesPromise = null;
let popularProductsPromise = null;

export const fetchTrendingSearches = async () => {
  if (searchesPromise) return searchesPromise;

  searchesPromise = (async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}/products/popular-searches`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      const payload = data.data || data;

      if (payload && Array.isArray(payload.popularSearches)) {
        return payload.popularSearches;
      }
      return FALLBACK_TRENDING_SEARCHES;
    } catch (error) {
      return FALLBACK_TRENDING_SEARCHES;
    }
  })();

  return searchesPromise;
};

export const fetchPopularProducts = async () => {
  if (popularProductsPromise) return popularProductsPromise;

  popularProductsPromise = (async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}/products?sort=bestseller&limit=10`);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      const payload = data.data || data;

      let products = FALLBACK_POPULAR_PRODUCTS;
      if (payload) {
        if (Array.isArray(payload)) {
          products = payload.map(p => ({ ...p, isTrending: true }));
        } else if (Array.isArray(payload.products)) {
          products = payload.products.map(p => ({ ...p, isTrending: true }));
        } else if (Array.isArray(payload.popularProducts)) {
          products = payload.popularProducts.map(p => ({ ...p, isTrending: true }));
        }
      }
      return products;
    } catch (error) {
      return FALLBACK_POPULAR_PRODUCTS;
    }
  })();

  return popularProductsPromise;
};

export const fetchContactMessages = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/contact`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};


// ─── Settings ────────────────────────────────────────────────────────────────
export const fetchSettings = async () => {
  try {
    const response = await fetch(`${COMBINED_URL}/settings`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateSettings = async (settingsData, token) => {
  try {
    const response = await fetch(`${COMBINED_URL}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ─── Bulk Delete Orders ──────────────────────────────────────────────────────
export const adminBulkDeleteOrders = async (orderIds, token) => {
  try {
    const response = await fetch(`${COMBINED_URL}/orders/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ orderIds })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};
