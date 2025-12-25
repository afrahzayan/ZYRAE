import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      setCartItems(response.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    setLoading(true);
    setError('');
    try {
      const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex !== -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        
        await api.put(`/cart/${updatedCart[existingItemIndex].id}`, updatedCart[existingItemIndex]);
        setCartItems(updatedCart);
      } else {
        const newCartItem = {
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        
        await api.post('/cart', newCartItem);
        setCartItems(prev => [...prev, newCartItem]);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(cartItemId);
    }
    
    setLoading(true);
    try {
      const updatedCart = cartItems.map(item => {
        if (item.id === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      const itemToUpdate = updatedCart.find(item => item.id === cartItemId);
      await api.put(`/cart/${cartItemId}`, itemToUpdate);
      
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      for (const item of cartItems) {
        await api.delete(`/cart/${item.id}`);
      }
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};