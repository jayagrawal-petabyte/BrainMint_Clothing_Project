import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('urbanwear_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('urbanwear_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const getId = (item) => item?._id || item?.id;

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => getId(item) === getId(product))) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => getId(item) !== productId));
  };

  const toggleWishlist = (product) => {
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
