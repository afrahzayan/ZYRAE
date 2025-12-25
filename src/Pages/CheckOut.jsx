import { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import { api } from '../API/Axios';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: user ? `${user.fname} ${user.lname}` : '',
    email: user ? user.email : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card' 
  });

  // Shipping cost
  const shippingCost = 0; 

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = parseFloat(getTotalPrice());
    return (subtotal + shippingCost).toFixed(2);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create order object
      const orderData = {
        id: Date.now().toString(),
        orderNumber: `ORD${Date.now().toString().slice(-6)}`,
        userId: user.id,
        userName: formData.fullName,
        userEmail: formData.email,
        userPhone: formData.phone,
        items: cartItems.map(item => ({
          productId: item.id || item.productId,
          name: item.name,
          price: parseFloat(item.price) || 0,
          image: item.image,
          quantity: item.quantity,
          size: item.size || '50ml'
        })),
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingZip: formData.zipCode,
        totalAmount: parseFloat(calculateTotal()),
        paymentMethod: formData.paymentMethod,
        status: 'processing',
        orderDate: new Date().toISOString()
      };

      // Save order to database
      await api.post('/orders', orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      // Show success message
      setOrderPlaced(true);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty and order not placed
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#5A4638' }}>Your Cart is Empty</h1>
            <p className="mb-8" style={{ color: '#8B7355' }}>Add items to your cart to checkout</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-lg font-medium transition duration-200"
              style={{ 
                backgroundColor: '#A79277',
                color: '#FFF2E1',
                border: '1px solid #8B7355'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#8B7355'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#A79277'}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Order placed success view
  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <div className="p-8 rounded-xl max-w-md mx-auto" style={{ 
              backgroundColor: '#FFF9F0',
              border: '1px solid #D1BB9E',
              boxShadow: '0 4px 6px rgba(167, 146, 119, 0.1)'
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" 
                style={{ backgroundColor: '#EAD8C0' }}>
                <span className="text-2xl" style={{ color: '#A79277' }}>✓</span>
              </div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: '#5A4638' }}>Order Confirmed!</h1>
              <p className="mb-6" style={{ color: '#8B7355' }}>
                Thank you for your order. We've sent a confirmation to {user?.email}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 rounded-lg font-medium transition duration-200"
                  style={{ 
                    backgroundColor: '#A79277',
                    color: '#FFF2E1',
                    border: '1px solid #8B7355'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#8B7355'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#A79277'}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-3 rounded-lg font-medium transition duration-200"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#5A4638',
                    border: '2px solid #A79277'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#A79277';
                    e.target.style.color = '#FFF2E1';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#5A4638';
                  }}
                >
                  View My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>Checkout</h1>
            <p className="text-lg" style={{ color: '#A79277' }}>Complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Shipping & Payment */}
            <div>
              {/* Shipping Details */}
              <div className="p-6 rounded-xl mb-6" style={{ 
                backgroundColor: '#FFF9F0',
                border: '1px solid #D1BB9E',
                boxShadow: '0 2px 4px rgba(167, 146, 119, 0.1)'
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Shipping Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                      style={{
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: '#5A4638'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A79277'}
                      onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                      style={{
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: '#5A4638'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A79277'}
                      onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                      style={{
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: '#5A4638'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A79277'}
                      onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 resize-none"
                      style={{
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: '#5A4638'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A79277'}
                      onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                        style={{
                          backgroundColor: '#FFF2E1',
                          border: '1px solid #D1BB9E',
                          color: '#5A4638'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#A79277'}
                        onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                        style={{
                          backgroundColor: '#FFF2E1',
                          border: '1px solid #D1BB9E',
                          color: '#5A4638'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#A79277'}
                        onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                      style={{
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: '#5A4638'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A79277'}
                      onBlur={(e) => e.target.style.borderColor = '#D1BB9E'}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 rounded-xl" style={{ 
                backgroundColor: '#FFF9F0',
                border: '1px solid #D1BB9E',
                boxShadow: '0 2px 4px rgba(167, 146, 119, 0.1)'
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Payment Method</h2>
                
                <div className="space-y-3">
                  {[
                    { id: 'card', name: 'Credit/Debit Card', desc: 'Pay with your card' },
                    { id: 'upi', name: 'UPI', desc: 'Pay via UPI apps' },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when item is delivered' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-200 ${
                        formData.paymentMethod === method.id 
                          ? 'border-2' 
                          : 'border'
                      }`}
                      style={{
                        backgroundColor: '#FFF2E1',
                        borderColor: formData.paymentMethod === method.id ? '#A79277' : '#D1BB9E'
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        formData.paymentMethod === method.id 
                          ? 'border-[#A79277]' 
                          : 'border-[#D1BB9E]'
                      }`}>
                        {formData.paymentMethod === method.id && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A79277' }}></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#5A4638' }}>{method.name}</p>
                        <p className="text-sm" style={{ color: '#8B7355' }}>{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="p-6 rounded-xl sticky top-6" style={{ 
                backgroundColor: '#FFF9F0',
                border: '1px solid #D1BB9E',
                boxShadow: '0 2px 4px rgba(167, 146, 119, 0.1)'
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b" 
                      style={{ borderColor: '#EAD8C0' }}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded overflow-hidden mr-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: '#5A4638' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: '#8B7355' }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium" style={{ color: '#A79277' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#8B7355' }}>Subtotal</span>
                    <span style={{ color: '#5A4638' }}>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#8B7355' }}>Shipping</span>
                    <span style={{ color: '#5A4638' }}>Free</span>
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: '#D1BB9E' }}>
                    <div className="flex justify-between text-lg font-bold">
                      <span style={{ color: '#5A4638' }}>Total</span>
                      <span style={{ color: '#5A4638' }}>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#A79277',
                    color: '#FFF2E1',
                    border: '1px solid #8B7355'
                  }}
                  onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#8B7355')}
                  onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#A79277')}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 mr-2" 
                        style={{ borderColor: '#FFF2E1' }}></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ₹${calculateTotal()}`
                  )}
                </button>

                {/* Security Note */}
                <p className="text-center text-sm mt-4" style={{ color: '#8B7355' }}>
                  Your payment is secure and encrypted
                </p>

                {/* Continue Shopping Link */}
                <Link
                  to="/products"
                  className="block text-center mt-4 font-medium transition duration-200 hover:underline"
                  style={{ color: '#A79277' }}
                  onMouseOver={(e) => e.target.style.color = '#8B7355'}
                  onMouseOut={(e) => e.target.style.color = '#A79277'}
                >
                  Continue Shopping
                </Link>

                {/* Contact Info */}
                <div className="mt-6 pt-4 border-t" style={{ borderColor: '#EAD8C0' }}>
                  <p className="text-xs text-center" style={{ color: '#8B7355' }}>
                    Need help? Call us <span className="font-medium" style={{ color: '#5A4638' }}>+91 12345 56789</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;