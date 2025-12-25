import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';

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

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/wishlist');
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      setError('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    setLoading(true);
    setError('');
    try {
      const existingItem = wishlistItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        setError('Item already in wishlist');
        setLoading(false);
        return false;
      }

      const newWishlistItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        addedAt: new Date().toISOString()
      };
      
      await api.post('/wishlist', newWishlistItem);
      setWishlistItems(prev => [...prev, newWishlistItem]);
      
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError('Failed to add item to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    setLoading(true);
    try {
      await api.delete(`/wishlist/${wishlistItemId}`);
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlistByProductId = async (productId) => {
    setLoading(true);
    try {
      const wishlistItem = wishlistItems.find(item => item.productId === productId);
      if (wishlistItem) {
        await api.delete(`/wishlist/${wishlistItem.id}`);
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (wishlistItem, cartContext) => {
    try {
      const success = await cartContext.addToCart({
        id: wishlistItem.productId,
        name: wishlistItem.name,
        price: wishlistItem.price,
        image: wishlistItem.image
      });
      
      if (success) {
        await removeFromWishlist(wishlistItem.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error moving to cart:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const clearWishlist = async () => {
    setLoading(true);
    try {
      for (const item of wishlistItems) {
        await api.delete(`/wishlist/${item.id}`);
      }
      setWishlistItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      setError('Failed to clear wishlist');
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