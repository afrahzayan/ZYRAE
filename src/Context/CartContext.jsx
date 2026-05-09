import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};

export const CartProvider = ({ children }) => {

  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');



  useEffect(() => {

    if (user) {
      fetchCartItems();
    }

  }, [user]);



  const fetchCartItems = async () => {

    if (!user) return;

    setLoading(true);

    try {

      const response = await api.get("/cart");

      setCartItems(response.data);

    } catch (error) {

      console.error("Error fetching cart items:", error);

      setError("Failed to load cart items");

    } finally {

      setLoading(false);

    }
  };


const addToCart = async (product) => {
  if (!user) {
    console.log("User not logged in");
    return false;
  }

  setLoading(true);
  setError("");

  try {
    const productId = product._id || product.id;
    
    // CHECK IF PRODUCT ALREADY EXISTS IN CART
    const existingItem = cartItems.find(
      item => item.productId === productId || item._id === productId
    );

    let response;
    
    if (existingItem) {
      // UPDATE EXISTING ITEM QUANTITY
      const newQuantity = existingItem.quantity + (product.quantity || 1);
      response = await api.put(`/cart/${existingItem._id}`, {
        ...existingItem,
        quantity: newQuantity
      });
      
      // Update local state
      setCartItems(prev =>
        prev.map(item =>
          item._id === existingItem._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      // ADD NEW ITEM
      const newCartItem = {
        productId: productId,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: product.quantity || 1,
        size: product.size || "50ml",
      };

      response = await api.post("/cart", newCartItem);
      setCartItems(prev => [...prev, response.data]);
    }
    
    return true;

  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error);
    setError("Failed to add item to cart");
    return false;
  } finally {
    setLoading(false);
  }
};



  const removeFromCart = async (cartItemId) => {

    setLoading(true);

    try {

      await api.delete(`/cart/${cartItemId}`);

      setCartItems(prev =>
        prev.filter(item => item._id !== cartItemId)
      );

      return true;

    } catch (error) {

      console.error("Error removing from cart:", error);

      setError("Failed to remove item from cart");

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
    // Update local state immediately for better UX
    const updatedCart = cartItems.map(item => {
      if (item._id === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);

    // Then update backend
    const itemToUpdate = updatedCart.find(item => item._id === cartItemId);
    await api.put(`/cart/${cartItemId}`, itemToUpdate);

    return true;

  } catch (error) {
    console.error("Error updating quantity:", error);
    setError("Failed to update quantity");
    // Revert on error
    await fetchCartItems();
    return false;
  } finally {
    setLoading(false);
  }
};



  // CLEAR CART - Improved version
const clearCart = async () => {
    if (!user) {
        setError("Please login to clear cart");
        return false;
    }

    setLoading(true);
    setError("");

    try {
        //  Delete all items one by one (current approach)
        const deletePromises = cartItems.map(item => 
            api.delete(`/cart/${item._id}`).catch(err => {
                console.error(`Failed to delete item ${item._id}:`, err);
                return null;
            })
        );
        
        await Promise.all(deletePromises);
        
        // Clear local state
        setCartItems([]);
         console.log("Cart cleared successfully");
        return true;

    } catch (error) {
        console.error("Error clearing cart:", error);
        setError("Failed to clear cart");
        return false;
    } finally {
        setLoading(false);
    }
};



  const getTotalPrice = () => {

    return cartItems
      .reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0)
      .toFixed(2);
  };



  const getTotalItems = () => {

    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
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