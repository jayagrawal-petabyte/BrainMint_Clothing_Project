const BASE_URL =
  "https://brainmint-clothing-project-combined.onrender.com/api";

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();

    return data.data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/${id}`
    );

    const data = await response.json();

    return data.data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const fetchNewArrivals = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/new-arrivals`
    );

    const data = await response.json();

    return data.data.products || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};