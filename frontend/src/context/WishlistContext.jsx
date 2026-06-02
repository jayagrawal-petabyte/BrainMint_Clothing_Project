import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchWishlist, addToWishlistApi, removeFromWishlistApi } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, isLoggedIn, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      try {
        const guestWishlist = localStorage.getItem('guestWishlist');
        if (guestWishlist) {
          setWishlistItems(JSON.parse(guestWishlist));
        } else {
          setWishlistItems([]);
        }
      } catch (e) {
        setWishlistItems([]);
      }
      return;
    }

    const loadWishlist = async () => {
      try {
        const guestWishlist = localStorage.getItem('guestWishlist');
        if (guestWishlist) {
          const parsedWishlist = JSON.parse(guestWishlist);
          if (parsedWishlist.length > 0) {
            // Merge guest wishlist to backend
            for (const item of parsedWishlist) {
              await addToWishlistApi(item._id || item.id, token);
            }
          }
          localStorage.removeItem('guestWishlist');
        }
      } catch (e) {
        localStorage.removeItem('guestWishlist');
      }

      const res = await fetchWishlist(token);
      if (res && res.data) {
        // Backend returns: data: { products: [ { ... }, { ... } ] } or data: { products: [] }
        const productsList = res.data.products || res.data || [];
        const mappedItems = Array.isArray(productsList) ? productsList.map(i => i.product || i) : [];
        setWishlistItems(mappedItems);
      }
    };
    loadWishlist();
  }, [isLoggedIn, token]);

  const getId = (item) => item?._id || item?.id;

  const addToWishlist = async (product) => {
    if (!isLoggedIn || !token) {
      setWishlistItems(prev => {
        if (prev.find(item => getId(item) === getId(product))) return prev;
        const newItems = [...prev, product];
        localStorage.setItem('guestWishlist', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    await addToWishlistApi(getId(product), token);
    setWishlistItems(prev => {
      if (prev.find(item => getId(item) === getId(product))) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn || !token) {
      setWishlistItems(prev => {
        const newItems = prev.filter(item => getId(item) !== productId);
        localStorage.setItem('guestWishlist', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    await removeFromWishlistApi(productId, token);
    setWishlistItems(prev => prev.filter(item => getId(item) !== productId));
  };

  const toggleWishlist = async (product) => {
    if (!isLoggedIn || !token) {
      setWishlistItems(prev => {
        const isCurrentlyWishlisted = prev.find(item => getId(item) === getId(product));
        let newItems;
        if (isCurrentlyWishlisted) {
          newItems = prev.filter(item => getId(item) !== getId(product));
        } else {
          newItems = [...prev, product];
        }
        localStorage.setItem('guestWishlist', JSON.stringify(newItems));
        return newItems;
      });
      return;
    }
    
    // Optimistic UI update
    const isCurrentlyWishlisted = wishlistItems.find(item => getId(item) === getId(product));
    
    if (isCurrentlyWishlisted) {
      setWishlistItems(prev => prev.filter(item => getId(item) !== getId(product)));
      await removeFromWishlistApi(getId(product), token);
    } else {
      setWishlistItems(prev => [...prev, product]);
      await addToWishlistApi(getId(product), token);
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => getId(item) === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
