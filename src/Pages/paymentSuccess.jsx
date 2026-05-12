import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";

const PaymentSuccess = () => {

  const navigate = useNavigate();

  const { clearCart } = useCart();

  const { user } = useAuth();

  const [message, setMessage] = useState("Processing payment...");

  useEffect(() => {

    // WAIT FOR USER AFTER STRIPE REDIRECT
    if (!user) {

      console.log("Waiting for user...");

      return;
    }

    const handlePaymentSuccess = async () => {

      try {

        console.log("User loaded:", user);

        setMessage("Clearing cart...");

        const success = await clearCart();

        console.log("Cart clear result:", success);

        if (success) {

          setMessage("Payment successful! Redirecting...");

        } else {

          setMessage("Payment successful but cart clear failed");
        }

      } catch (error) {

        console.log(error);

        setMessage("Something went wrong");
      }

      setTimeout(() => {

        navigate("/orders", { replace: true });

      }, 2000);
    };

    handlePaymentSuccess();

  }, [user]);

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <p>{message}</p>

      </div>

    </div>
  );
};

export default PaymentSuccess;