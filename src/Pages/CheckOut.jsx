import { useState, useCallback } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar';
import { api } from '../api/axios';



const Toast = ({ toasts, removeToast }) => {
  const styles = {
    success: { bg: '#10B981', icon: '✓' },
    error:   { bg: '#EF4444', icon: '✕' },
    info:    { bg: '#A79277', icon: 'ℹ' },
  };

  return (
    <div
      className="fixed z-50 flex flex-col gap-3"
      style={{ top: '80px', right: '16px', maxWidth: '360px' }}
    >
      {toasts.map((toast) => {
        const { bg, icon } = styles[toast.type] || styles.info;
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white"
            style={{ backgroundColor: bg, animation: 'slideInRight 0.3s ease-out' }}
          >
            <span className="text-lg font-bold mt-0.5 shrink-0">{icon}</span>
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-80 hover:opacity-100 text-white font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};


const normalizeCartItem = (item) => {
  if (item.product && typeof item.product === 'object' && item.product.name) {
    return {
      productId: item.product._id || item.product.id,
      name:      item.product.name,
      price:     parseFloat(item.price ?? item.product.price ?? 0),
      image:     item.product.image || '',
      quantity:  item.quantity,
      size:      item.size || item.product.size || null,
    };
  }

  return {
    productId: item.productId || item.id || item._id,
    name:      item.name,
    price:     parseFloat(item.price ?? 0),
    image:     item.image || '',
    quantity:  item.quantity,
    size:      item.size || null,
  };
};



const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [loading, setLoading]           = useState(false);
  const [orderPlaced, setOrderPlaced]   = useState(false);

  const [formData, setFormData] = useState({
    fullName:      user ? `${user.fname} ${user.lname}` : '',
    email:         user ? user.email : '',
    phone:         '',
    address:       '',
    city:          '',
    state:         '',
    zipCode:       '',
    paymentMethod: 'online',
  });

  const shippingCost = 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const getNumericTotal = () => {
    const raw = String(getTotalPrice()).replace(/,/g, '');
    const n   = parseFloat(raw);
    return isNaN(n) ? 0 : n + shippingCost;
  };

  const calculateTotal = () => getNumericTotal().toFixed(2);

  const validateForm = () => {
    const { fullName, email, phone, address, city } = formData;
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      addToast('Please fill all required fields (*)', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!/^[+\d\s\-()]{7,15}$/.test(phone.trim())) {
      addToast('Please enter a valid phone number (7–15 digits)', 'error');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {

      const normalizedItems = cartItems.map(normalizeCartItem);

      const badItem = normalizedItems.find((i) => !i.name || i.price == null);
      if (badItem) {
        addToast('One or more cart items have missing data. Please refresh and try again.', 'error');
        setLoading(false);
        return;
      }

      const orderData = {
        userName:        formData.fullName,
        userEmail:       formData.email,
        userPhone:       formData.phone,
        items:           normalizedItems.map((item) => ({
          productId: item.productId,
          name:      item.name,
          price:     item.price,
          image:     item.image,
          quantity:  item.quantity,
          ...(item.size ? { size: item.size } : {}),
        })),
        shippingAddress: formData.address,
        shippingCity:    formData.city,
        shippingState:   formData.state,
        shippingZip:     formData.zipCode,
        totalAmount:     parseFloat(calculateTotal()),
        paymentMethod:   formData.paymentMethod,
      };

      if (formData.paymentMethod === 'cod') {
        const response = await api.post('/orders/create-cod-order', orderData);
        if (response.data.success) {
          await clearCart();
          setOrderPlaced(true);
        } else {
          addToast(response.data.error || 'Failed to place order. Please try again.', 'error');
        }
      } else {
        const response = await api.post('/orders/create-checkout-session', orderData);
        if (!response.data.url) {
          addToast('Could not initiate payment session. Please try again.', 'error');
          return;
        }
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Order error:', error);
      addToast(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getItemKey  = (item) => {
    if (item.product && typeof item.product === 'object') return item.product._id || item.product.id;
    return item.id ?? item.productId ?? item._id ?? item.name;
  };
  const getItemName  = (item) => (item.product?.name  ?? item.name  ?? 'Product');
  const getItemImage = (item) => (item.product?.image ?? item.image ?? '');
  const getItemPrice = (item) => parseFloat(item.price ?? item.product?.price ?? 0);


  const cardStyle = {
    backgroundColor: '#FFF9F0',
    border: '1px solid #D1BB9E',
    boxShadow: '0 2px 4px rgba(167,146,119,0.1)',
  };
  const inputStyle = {
    backgroundColor: '#FFF2E1',
    border: '1px solid #D1BB9E',
    color: '#5A4638',
  };
  const btnPrimary = {
    backgroundColor: '#A79277',
    color: '#FFF2E1',
    border: '1px solid #8B7355',
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <>
        <Navbar />
        <Toast toasts={toasts} removeToast={removeToast} />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#5A4638' }}>Your Cart is Empty</h1>
            <p className="mb-8" style={{ color: '#8B7355' }}>Add items to your cart to checkout</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-lg font-medium transition duration-200"
              style={btnPrimary}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#8B7355')}
              onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = '#A79277')}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <div className="p-8 rounded-xl max-w-md mx-auto" style={cardStyle}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#EAD8C0' }}
              >
                <span className="text-2xl" style={{ color: '#A79277' }}>✓</span>
              </div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: '#5A4638' }}>Order Confirmed!</h1>
              <p className="mb-6" style={{ color: '#8B7355' }}>
                Thank you for your order. You will pay when your order is delivered.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full py-3 rounded-lg font-medium transition duration-200"
                  style={btnPrimary}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#8B7355')}
                  onMouseOut={(e)  => (e.currentTarget.style.backgroundColor = '#A79277')}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-3 rounded-lg font-medium transition duration-200"
                  style={{ backgroundColor: 'transparent', color: '#5A4638', border: '2px solid #A79277' }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#A79277'; e.currentTarget.style.color = '#FFF2E1'; }}
                  onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5A4638'; }}
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


  const textFields = [
    { label: 'Full Name',    name: 'fullName', type: 'text',  required: true },
    { label: 'Email',        name: 'email',    type: 'email', required: true },
    { label: 'Phone Number', name: 'phone',    type: 'tel',   required: true },
  ];

  const cityStateFields = [
    { label: 'City',  name: 'city',  required: true  },
    { label: 'State', name: 'state', required: false },
  ];

  const paymentOptions = [
    { value: 'online', label: 'Online Payment',   desc: 'Pay with Credit/Debit Card, UPI, NetBanking' },
    { value: 'cod',    label: 'Cash on Delivery', desc: 'Pay when your order is delivered' },
  ];

  return (
    <>
      <Navbar />
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>Checkout</h1>
            <p className="text-lg" style={{ color: '#A79277' }}>Complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div>

              <div className="p-6 rounded-xl mb-6" style={cardStyle}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Shipping Details</h2>

                <div className="space-y-4">
                  {textFields.map(({ label, name, type, required }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        required={required}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = '#A79277')}
                        onBlur={(e)  => (e.target.style.borderColor = '#D1BB9E')}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                      Address <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 resize-none"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#A79277')}
                      onBlur={(e)  => (e.target.style.borderColor = '#D1BB9E')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cityStateFields.map(({ label, name, required }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          required={required}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = '#A79277')}
                          onBlur={(e)  => (e.target.style.borderColor = '#D1BB9E')}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#A79277')}
                      onBlur={(e)  => (e.target.style.borderColor = '#D1BB9E')}
                    />
                  </div>
                </div>
              </div>

              
              <div className="p-6 rounded-xl" style={cardStyle}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Payment Method</h2>
                <div className="space-y-3">
                  {paymentOptions.map(({ value, label, desc }) => {
                    const selected = formData.paymentMethod === value;
                    return (
                      <div
                        key={value}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-200 ${selected ? 'border-2' : 'border'}`}
                        style={{ backgroundColor: '#FFF2E1', borderColor: selected ? '#A79277' : '#D1BB9E' }}
                        onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selected ? 'border-[#A79277]' : 'border-[#D1BB9E]'}`}
                        >
                          {selected && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A79277' }} />}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#5A4638' }}>{label}</p>
                          <p className="text-sm"    style={{ color: '#8B7355' }}>{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="p-6 rounded-xl sticky top-6" style={cardStyle}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>Order Summary</h2>


                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map((item) => {
                    const name  = getItemName(item);
                    const image = getItemImage(item);
                    const price = getItemPrice(item);
                    return (
                      <div
                        key={getItemKey(item)}
                        className="flex items-center justify-between py-3 border-b"
                        style={{ borderColor: '#EAD8C0' }}
                      >
                        <div className="flex items-center">

                          <div
                            className="w-12 h-12 rounded overflow-hidden mr-4 shrink-0 flex items-center justify-center text-xl"
                            style={{ backgroundColor: '#EAD8C0' }}
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentNode.textContent = '🧴';
                                }}
                              />
                            ) : (
                              '🧴'
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: '#5A4638' }}>{name}</p>
                            <p className="text-xs" style={{ color: '#8B7355' }}>Qty: {item.quantity}</p>
                            {(item.size || item.product?.size) && (
                              <p className="text-xs" style={{ color: '#8B7355' }}>
                                Size: {item.size || item.product?.size}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-medium shrink-0 ml-2" style={{ color: '#A79277' }}>
                          ₹{(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>


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

                
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={btnPrimary}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#8B7355')}
                  onMouseOut={(e)  => !loading && (e.currentTarget.style.backgroundColor = '#A79277')}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2"
                        style={{ borderColor: '#FFF2E1' }}
                      />
                      Processing...
                    </div>
                  ) : formData.paymentMethod === 'cod' ? (
                    `Place Order (Cash on Delivery) — ₹${calculateTotal()}`
                  ) : (
                    `Pay Online — ₹${calculateTotal()}`
                  )}
                </button>

                <p className="text-center text-sm mt-4" style={{ color: '#8B7355' }}>
                  🔒 Your payment is secure and encrypted
                </p>

                <Link
                  to="/products"
                  className="block text-center mt-4 font-medium transition duration-200 hover:underline"
                  style={{ color: '#A79277' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#8B7355')}
                  onMouseOut={(e)  => (e.currentTarget.style.color = '#A79277')}
                >
                  ← Continue Shopping
                </Link>

                <div className="mt-6 pt-4 border-t" style={{ borderColor: '#EAD8C0' }}>
                  <p className="text-xs text-center" style={{ color: '#8B7355' }}>
                    Need help? Call us{' '}
                    <span className="font-medium" style={{ color: '#5A4638' }}>+91 12345 56789</span>
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