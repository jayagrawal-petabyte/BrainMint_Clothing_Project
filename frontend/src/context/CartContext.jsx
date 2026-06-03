import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, syncAddToCart, removeFromCartApi, updateCartQuantityApi } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      try {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          setCartItems(JSON.parse(guestCart));
        } else {
          setCartItems([]);
        }
      } catch (e) {
        setCartItems([]);
      }
      return;
    }

    const loadCart = async () => {
      try {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          const parsedCart = JSON.parse(guestCart);
          if (parsedCart.length > 0) {
            // Merge guest items to backend
            for (const item of parsedCart) {
              await syncAddToCart(item._id || item.id, item.quantity, item.size, item.color, token);
            }
          }
          localStorage.removeItem('guestCart');
        }
      } catch (e) {
        localStorage.removeItem('guestCart');
      }

      const res = await fetchCart(token);
      if (res && (res.data || res.items || Array.isArray(res))) {
        const itemsList = res.data?.items || res.items || res.data || res || [];
        // Support both nested { product, quantity } or flat array
        const mappedItems = Array.isArray(itemsList) ? itemsList.map(i => ({
          ...(i.product || i),
          quantity: i.quantity || 1,
          size: i.size || '',
          color: i.color || ''
        })) : [];
        setCartItems(mappedItems);
      }
    };
    loadCart();
  }, [isLoggedIn, token]);

  const getId = (item) => item?._id || item?.id;
  const getPrice = (item) => item?.discountPrice || item?.price || 0;

  const addToCart = async (product, quantity = 1, size = '', color = '') => {
    if (!isLoggedIn || !token) {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => getId(item) === getId(product) && item.size === size && item.color === color);
        let newItems;
        if (existingItem) {
          newItems = prevItems.map(item =>
            (getId(item) === getId(product) && item.size === size && item.color === color) ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newItems = [...prevItems, { ...product, quantity, size, color }];
        }
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    
    // Sync with backend API
    await syncAddToCart(getId(product), quantity, size, color, token);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => getId(item) === getId(product) && item.size === size && item.color === color);
      if (existingItem) {
        return prevItems.map(item =>
          (getId(item) === getId(product) && item.size === size && item.color === color) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity, size, color }];
    });
  };

  // Use a unique combination of ID, size, and color for exact item matching
  const removeFromCart = async (productId, size = '', color = '') => {
    if (!isLoggedIn || !token) {
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => !(getId(item) === productId && item.size === size && item.color === color));
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    
    await removeFromCartApi(productId, token);
    setCartItems(prevItems => prevItems.filter(item => !(getId(item) === productId && item.size === size && item.color === color)));
  };

  const updateQuantity = async (productId, quantity, size = '', color = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    if (!isLoggedIn || !token) {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          (getId(item) === productId && item.size === size && item.color === color) ? { ...item, quantity } : item
        );
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    
    await updateCartQuantityApi(productId, quantity, token);
    setCartItems(prevItems =>
      prevItems.map(item =>
        (getId(item) === productId && item.size === size && item.color === color) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (!isLoggedIn || !token) {
      localStorage.removeItem('guestCart');
    }
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
