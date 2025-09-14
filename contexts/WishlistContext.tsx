import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface WishlistContextType {
  wishlist: string[]; // Array of tour IDs
  addToWishlist: (tourId: string) => void;
  removeFromWishlist: (tourId: string) => void;
  isTourInWishlist: (tourId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (tourId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(tourId)) {
        return prevWishlist;
      }
      return [...prevWishlist, tourId];
    });
  };

  const removeFromWishlist = (tourId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== tourId));
  };

  const isTourInWishlist = (tourId: string) => {
    return wishlist.includes(tourId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isTourInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
