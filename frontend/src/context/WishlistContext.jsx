import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      await api.post('/wishlist', {
        product_id: product.id,
        product_name: product.heading || product.name,
        product_price: product.price,
        product_image: product.front_image || product.image || '',
      });
      await fetchWishlist();
      toast.success('Added to wishlist ❤️');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/product/${productId}`);
      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return items.some((item) => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};