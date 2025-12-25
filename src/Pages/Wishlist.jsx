
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar';

const HeartIconFilled = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


const ShoppingBagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);


const DeleteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Wishlist = () => {
  const { 
    wishlistItems, 
    loading, 
    error, 
    removeFromWishlist,
    moveToCart,
    clearWishlist 
  } = useWishlist();
  
  const cart = useCart();

  const handleMoveToCart = async (item) => {
    await moveToCart(item, cart);
  };

  
  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <HeartIconFilled className="w-24 h-24 mx-auto mb-6" style={{ color: '#A79277' }} />
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#5A4638' }}>Your Wishlist is Empty</h1>
              <p className="text-lg mb-8" style={{ color: '#8B7355' }}>
                Save items you love to your wishlist. Review them anytime and easily move them to your cart.
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
          
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#5A4638' }}>My Wishlist</h1>
              <p className="text-lg mt-2" style={{ color: '#8B7355' }}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            <button
              onClick={clearWishlist}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
              style={{ 
                backgroundColor: '#FFEBEE',
                color: '#EF5350',
                border: '1px solid #EF5350'
              }}
            >
              Clear All
            </button>
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

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: '#FFF9F0',
                  border: '1px solid #D1BB9E'
                }}
              >
                
                <div className="relative mb-4">
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                  
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={loading}
                    className="absolute top-2 right-2 p-2 rounded-full transition duration-200"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#EF5350'
                    }}
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>

                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg truncate" style={{ color: '#5A4638' }}>
                    {item.name}
                  </h3>
                  <p className="text-xl font-bold" style={{ color: '#A79277' }}>
                    ₹{item.price.toFixed(2)}
                  </p>
                  
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={loading}
                      className="flex-1 py-2 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2"
                      style={{ 
                        backgroundColor: '#A79277',
                        color: '#FFF2E1'
                      }}
                      onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#8B7355')}
                      onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#A79277')}
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition duration-200"
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
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;