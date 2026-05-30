import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // When user auth changes, load their specific wishlist from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      setWishlistItems([]);
      return;
    }

    const storageKey = `urbanwear_wishlist_${user?.email}`;
    try {
      const saved = localStorage.getItem(storageKey);
      setWishlistItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setWishlistItems([]);
    }
  }, [isLoggedIn, user]);

  // When wishlistItems changes, save to their specific localStorage (only if logged in)
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const storageKey = `urbanwear_wishlist_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoggedIn, user]);

  const getId = (item) => item?._id || item?.id;

  const addToWishlist = (product) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your wishlist!");
      return;
    }
    setWishlistItems(prev => {
      if (prev.find(item => getId(item) === getId(product))) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => getId(item) !== productId));
  };

  const toggleWishlist = (product) => {
    if (!isLoggedIn) {
      alert("Please login to use the wishlist!");
      return;
    }
    if (wishlistItems.find(item => getId(item) === getId(product))) {
      removeFromWishlist(getId(product));
    } else {
      addToWishlist(product);
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
