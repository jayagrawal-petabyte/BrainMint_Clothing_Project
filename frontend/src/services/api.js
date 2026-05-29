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
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Register error:", error);
    return null;
  }
};

// ─── Cart / Orders ─────────────────────────────────────────────────────────────
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