import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // When user auth changes, load their specific cart from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }

    const storageKey = `urbanwear_cart_${user?.email}`;
    try {
      const saved = localStorage.getItem(storageKey);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCartItems([]);
    }
  }, [isLoggedIn, user]);

  // When cartItems changes, save to their specific localStorage (only if logged in)
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const storageKey = `urbanwear_cart_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn, user]);

  const getId = (item) => item?._id || item?.id;
  const getPrice = (item) => item?.discountPrice || item?.price || 0;

  const addToCart = (product, quantity = 1) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart!");
      return;
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => getId(item) === getId(product));
      if (existingItem) {
        return prevItems.map(item =>
          getId(item) === getId(product) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => getId(item) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        getId(item) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + getPrice(item) * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
