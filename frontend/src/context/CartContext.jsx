import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = '', color = '') => {
    try {
      const response = await api.post('/cart', {
        product_id: product.id,
        product_name: product.heading || product.name,
        product_price: product.price,
        product_image: product.front_image || product.image || '',
        quantity,
        size,
        color,
      });
      await fetchCart();
      toast.success('Added to cart!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      throw error;
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};