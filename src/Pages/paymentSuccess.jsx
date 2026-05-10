import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const PaymentSuccess = () => {

  const navigate = useNavigate();

  const { clearCart, fetchCartItems } = useCart();

  const [isClearing, setIsClearing] = useState(true);

  useEffect(() => {

    let mounted = true;

    const clearCartAndRedirect = async () => {

      try {

        // CLEAR CART
        await clearCart();

        // REFRESH CART STATE
        await fetchCartItems();

        console.log("Cart cleared successfully");

      } catch (error) {

        console.error("Error clearing cart:", error);

      } finally {

        if (mounted) {

          setIsClearing(false);

          // REDIRECT AFTER 2 SECONDS
          setTimeout(() => {

            navigate("/orders", { replace: true });

          }, 2000);
        }
      }
    };

    clearCartAndRedirect();

    return () => {

      mounted = false;

    };

  }, []); // IMPORTANT: EMPTY DEPENDENCY ARRAY

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600">
          {isClearing
            ? "Clearing your cart..."
            : "Redirecting to your orders..."}
        </p>

      </div>

    </div>
  );
};

export default PaymentSuccess;