import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, syncAddToCart } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setCartItems([]);
      return;
    }

    const loadCart = async () => {
      const res = await fetchCart(token);
      if (res && (res.data || res.items || Array.isArray(res))) {
        const itemsList = res.data?.items || res.items || res.data || res || [];
        // Support both nested { product, quantity } or flat array
        const mappedItems = Array.isArray(itemsList) ? itemsList.map(i => ({
          ...(i.product || i),
          quantity: i.quantity || 1
        })) : [];
        setCartItems(mappedItems);
      }
    };
    loadCart();
  }, [isLoggedIn, token]);

  const getId = (item) => item?._id || item?.id;
  const getPrice = (item) => item?.discountPrice || item?.price || 0;

  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn || !token) {
      alert("Please login to add items to your cart!");
      return;
    }
    
    // Sync with backend API
    await syncAddToCart(getId(product), quantity, token);

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
