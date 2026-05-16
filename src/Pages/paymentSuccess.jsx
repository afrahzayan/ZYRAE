import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";

const PaymentSuccess = () => {
  const navigate    = useNavigate();
  const { clearCart } = useCart();
  const { user }    = useAuth();
  const [message, setMessage] = useState("Processing payment...");
  const hasProcessed = useRef(false);

  
  useEffect(() => {

  if (!user || hasProcessed.current) return;

  hasProcessed.current = true;

  const handlePaymentSuccess = async () => {

    try {

      setMessage("Clearing cart...");

      const success = await clearCart();

      setMessage(
        success
          ? "Payment successful! Redirecting to your orders..."
          : "Payment successful! Redirecting..."
      );

    } catch (error) {

      console.error("PaymentSuccess: clearCart failed:", error);

      setMessage("Payment confirmed. Redirecting...");

    } finally {

      setTimeout(() => {

        navigate("/orders", { replace: true });

      }, 2500);

    }
  };

  handlePaymentSuccess();

}, [user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFF2E1" }}
    >
      <div
        className="text-center p-8 rounded-xl shadow-sm"
        style={{ backgroundColor: "#FFF9F0", border: "1px solid #D1BB9E" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#EAD8C0" }}
        >
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#5A4638" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "#8B7355" }}>{message}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;