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

      setCartItems(response.data || []);

    } catch (error) {

      console.error("Error fetching cart items:", error);

      setError("Failed to load cart items");

    } finally {

      setLoading(false);

    }
  };


const addToCart = async (product) => {

  try {

    console.log("ADDING PRODUCT:", product);

    const productId =
      product.productId ||
      product._id ||
      product.id;

    if (!productId) {

      console.error("Missing Product ID", product);

      return false;
    }

    await api.post("/cart", {
      productId,
      quantity: product.quantity || 1,
      price: Number(product.price) || 0,
      
    });

    await fetchCartItems();

    return true;

  } catch (error) {

    console.log(
      "ADD TO CART ERROR:",
      error.response?.data || error
    );

    return false;
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
    await api.put(`/cart/${cartItemId}`, {
     quantity: newQuantity
     });
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

    console.log("No user found");

    return false;
  }

  setLoading(true);

  try {

    console.log("Calling clear cart API");

    await api.delete("/cart/clear/all");

    setCartItems([]);

    console.log("Cart cleared successfully");

    return true;

  } catch (error) {

    console.error("Error clearing cart:", error);

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