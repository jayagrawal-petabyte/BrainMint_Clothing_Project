// ─── Backend Service URLs ────────────────────────────────────────────────────
const AUTH_URL    = "https://brainmint-clothing-project-final.onrender.com/api";      // Person 1 – Auth
const PRODUCTS_URL = "https://brainmint-clothing-project-person2.onrender.com/api";   // Person 2 – Products
const CART_URL    = "https://brainmint-clothing-project-1.onrender.com/api";          // Person 3 – Cart, Orders, Wishlist

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

export const syncAddToCart = async (productId, quantity, token) => {
  try {
    const response = await fetch(`${CART_URL}/cart`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ productId, quantity }),
    });
    return await response.json();
  } catch (error) {
    console.error("Add to cart error:", error);
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
