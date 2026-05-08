import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch wishlist when user logs in/out
  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]); // Clear wishlist when user logs out
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.get('/wishlist');
      // Your backend returns { success, message, data }
      if (response.data.success) {
        setWishlistItems(response.data.data || []);
      } else {
        setWishlistItems([]);
      }
      setError('');
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      setError(error.response?.data?.message || 'Failed to load wishlist items');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      setError('Please login to add items to wishlist');
      return false;
    }
    
    setLoading(true);
    setError('');
    try {
      const productId = product.id || product._id;
      
      // Your backend expects POST to /wishlist/add/:id
      const response = await api.post(`/wishlist/add/${productId}`);
      
      if (response.data.success) {
        // Fetch updated wishlist to get complete product details
        await fetchWishlistItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError(error.response?.data?.message || 'Failed to add item to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      // Your backend expects DELETE to /wishlist/remove/:id
      const response = await api.delete(`/wishlist/remove/${productId}`);
      
      if (response.data.success) {
        // Remove from local state
        setWishlistItems(prev => prev.filter(item => item._id !== productId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError(error.response?.data?.message || 'Failed to remove item from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // This function is not needed for your backend structure, but kept for compatibility
  const removeFromWishlistByProductId = async (productId) => {
    return removeFromWishlist(productId);
  };

  const moveToCart = async (wishlistItem, cartContext) => {
    try {
      // Add to cart
      const success = await cartContext.addToCart({
        id: wishlistItem._id,
        _id: wishlistItem._id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        image: wishlistItem.image,
        description: wishlistItem.description
      });
      
      if (success) {
        // Remove from wishlist
        await removeFromWishlist(wishlistItem._id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error moving to cart:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const clearWishlist = async () => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Your backend expects DELETE to /wishlist/clear
      const response = await api.delete('/wishlist/clear');
      
      if (response.data.success) {
        setWishlistItems([]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      setError(error.response?.data?.message || 'Failed to clear wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProductId,
    moveToCart,
    isInWishlist,
    clearWishlist,
    fetchWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};