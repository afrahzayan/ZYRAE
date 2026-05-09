import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearCart, fetchCartItems } = useCart();
  const [isClearing, setIsClearing] = useState(true);

  useEffect(() => {
    const clearCartAndRedirect = async () => {
      try {
        // Clear the cart
        const success = await clearCart();
        
        if (success) {
          console.log("Cart cleared successfully");
          // Verify cart is empty
          await fetchCartItems();
        } else {
          console.log("Failed to clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      } finally {
        setIsClearing(false);
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      }
    };

    clearCartAndRedirect();
  }, [clearCart, fetchCartItems, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600">
          {isClearing ? "Clearing your cart..." : "Redirecting to your orders..."}
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;