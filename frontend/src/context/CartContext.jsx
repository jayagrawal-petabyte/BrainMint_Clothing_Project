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
              await syncAddToCart(item._id || item.id, item.quantity, token);
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
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => getId(item) === getId(product));
        let newItems;
        if (existingItem) {
          newItems = prevItems.map(item =>
            getId(item) === getId(product) ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newItems = [...prevItems, { ...product, quantity }];
        }
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
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
    if (!isLoggedIn || !token) {
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => getId(item) !== productId);
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    // Note: assuming a backend API call exists or is implemented to remove item. 
    // If not, we just update local state for logged in users as it currently did.
    setCartItems(prevItems => prevItems.filter(item => getId(item) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (!isLoggedIn || !token) {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          getId(item) === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        getId(item) === productId ? { ...item, quantity } : item
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
