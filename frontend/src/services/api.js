// ─── Backend Service URLs ────────────────────────────────────────────────────
const AUTH_URL    = "https://brainmint-clothing-project-combined.onrender.com/api";
const PRODUCTS_URL = "https://brainmint-clothing-project-combined.onrender.com/api";
const CART_URL    = "https://brainmint-clothing-project-combined.onrender.com/api";

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchProducts = async (params = "") => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products${params}`);
    const data = await response.json();
    return data.data || { products: [], pagination: { total: 0, pages: 0, page: 1 } };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], pagination: { total: 0, pages: 0, page: 1 } };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const fetchNewArrivals = async () => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/new-arrivals`);
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${PRODUCTS_URL}/categories`);
    const data = await response.json();
    return data.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
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
    console.error("Login error:", error);
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
    console.error("Forgot password error:", error);
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
    console.error("Reset password error:", error);
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
    console.error("Register error:", error);
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
    console.error("Fetch profile error:", error);
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
    console.error("Fetch profile error:", error);
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
    console.error("Update profile error:", error);
    return null;
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
    console.error("Contact form error:", error);
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
    console.error("Fetch cart error:", error);
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
    console.error("Add to cart error:", error);
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
    console.error("Remove from cart error:", error);
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
    console.error("Update cart error:", error);
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
    console.error("Fetch wishlist error:", error);
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
    console.error("Add wishlist error:", error);
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
    console.error("Remove wishlist error:", error);
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
    console.error("Order error:", error);
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
    console.error("Fetch orders error:", error);
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
      console.warn("Using fallback trending searches due to API fetch error:", error);
      return FALLBACK_TRENDING_SEARCHES;
    }
  })();

  return searchesPromise;
};

export const fetchPopularProducts = async () => {
  if (popularProductsPromise) return popularProductsPromise;

  popularProductsPromise = (async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}/products/trending`);
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
      console.warn("Using fallback popular products due to API fetch error:", error);
      return FALLBACK_POPULAR_PRODUCTS;
    }
  })();

  return popularProductsPromise;
};

