// â”€â”€â”€ Backend Service URLs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AUTH_URL    = "https://brainmint-clothing-project-final.onrender.com/api";      // Person 1 â€“ Auth
const PRODUCTS_URL = "https://brainmint-clothing-project-person2.onrender.com/api";   // Person 2 â€“ Products
const CART_URL    = "https://brainmint-clothing-project-1.onrender.com/api";          // Person 3 â€“ Cart, Orders, Wishlist

// â”€â”€â”€ Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Cart / Orders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
