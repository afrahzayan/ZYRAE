import { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar';


const DeleteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);


const MinusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
  </svg>
);


const ShoppingCartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  const navigate = useNavigate()

  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + change);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    const success = await clearCart();
    setIsClearing(false);
  };

  
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <ShoppingCartIcon className="w-24 h-24 mx-auto mb-6" style={{ color: '#A79277' }} />
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#5A4638' }}>Your Cart is Empty</h1>
              <p className="text-lg mb-8" style={{ color: '#8B7355' }}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition duration-200"
                style={{
                  backgroundColor: '#A79277',
                  color: '#FFF2E1',
                  border: '1px solid #8B7355'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#8B7355'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#A79277'}
              >
                Start Shopping
              </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#5A4638' }}>Shopping Cart</h1>
            <p className="text-lg mt-2" style={{ color: '#8B7355' }}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {error && (
            <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ backgroundColor: '#FFEBEE', border: '1px solid #EF5350', color: '#C62828' }}>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    style={{
                      backgroundColor: '#FFF9F0',
                      border: '1px solid #D1BB9E'
                    }}
                  >
                    

                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                    </div>

                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: '#5A4638' }}>
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold mb-3" style={{ color: '#A79277' }}>
                        ₹{item.price.toFixed(2)}
                      </p>

                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded disabled:opacity-50 transition duration-200"
                            style={{
                              backgroundColor: '#A79277',
                              color: '#FFF2E1'
                            }}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 rounded" style={{
                            backgroundColor: '#FFF2E1',
                            border: '1px solid #D1BB9E',
                            color: '#5A4638',
                            minWidth: '3rem',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 rounded transition duration-200"
                            style={{
                              backgroundColor: '#A79277',
                              color: '#FFF2E1'
                            }}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        
                        <div className="ml-4 text-lg font-semibold" style={{ color: '#5A4638' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="p-2 rounded-lg transition duration-200 hover:bg-red-50 self-start sm:self-center"
                      style={{ color: '#EF5350' }}
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

            
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleClearCart}
                  disabled={isClearing || loading}
                  className="px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                  style={{
                    backgroundColor: '#FFEBEE',
                    color: '#EF5350',
                    border: '1px solid #EF5350'
                  }}
                  onMouseOver={(e) => !isClearing && (e.target.style.backgroundColor = '#FFCDD2')}
                  onMouseOut={(e) => !isClearing && (e.target.style.backgroundColor = '#FFEBEE')}
                >
                  {isClearing ? 'Clearing...' : 'Clear Cart'}
                </button>
              </div>
            </div>

          
            <div>
              <div className="rounded-xl p-6 sticky top-24"
                style={{
                  backgroundColor: '#FFF9F0',
                  border: '1px solid #D1BB9E'
                }}
              >
                <h2 className="text-xl font-bold mb-6" style={{ color: '#5A4638' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#8B7355' }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: '#5A4638' }}>
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#8B7355' }}>Shipping</span>
                    <span className="font-semibold" style={{ color: '#5A4638' }}>
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t" style={{ borderColor: '#D1BB9E' }}>
                    <span style={{ color: '#5A4638' }}>Total</span>
                    <span style={{ color: '#5A4638' }}>
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                </div>

              
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                  style={{
                    backgroundColor: '#A79277',
                    color: '#FFF2E1',
                    border: '1px solid #8B7355'
                  }}
                  onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#8B7355')}
                  onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#A79277')}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="mt-6 text-center">
                  <Link
                    to="/products"
                    className="text-sm font-medium hover:underline transition duration-200"
                    style={{ color: '#A79277' }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;