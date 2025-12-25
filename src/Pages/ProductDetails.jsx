import  { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';

const HeartIconOutline = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const HeartIconFilled = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? '#10B981' : '#EF4444'

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideIn">
      <div 
        className="flex items-center p-4 rounded-lg shadow-lg text-white"
        style={{ backgroundColor: bgColor }}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {type === 'success' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const sizes = ['50ml', '100ml'];
  const sizePriceMultipliers = {
    '50ml': 1,    
    '100ml': 2    
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product && product.price) {
      const basePrice = parseFloat(product.price) || 0;
      const multiplier = sizePriceMultipliers[selectedSize] || 1;
      setCurrentPrice(basePrice * multiplier);
    }
  }, [product, selectedSize]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to add items to cart' } });
      return;
    }

    setAddingToCart(true);
    try {
      const productWithDetails = {
        id: product.id,
        name: product.name,
        price: currentPrice, 
        image: product.image,
        size: selectedSize,
        originalPrice: parseFloat(product.price) || 0, 
        quantity: quantity
      };
      
      const success = await addToCart(productWithDetails);
      
      if (success) {
        showToast(`${product.name} (${selectedSize}) added to cart successfully!`, 'success')
      } else {
        showToast('Failed to add item to cart. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to add items to wishlist' } });
      return;
    }

    setAddingToWishlist(true);
    try {
      if (isInWishlist(product.id)) {
        const wishlistResponse = await api.get('/wishlist');
        const wishlistItem = wishlistResponse.data.find(item => item.productId === product.id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
          showToast(`${product.name} removed from wishlist`, 'success')
        }
      } else {
        const productForWishlist = {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          image: product.image
        };
        await addToWishlist(productForWishlist);
        showToast(`${product.name} added to wishlist!`, 'success')
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('Failed to update wishlist. Please try again.', 'error')
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to buy products' } });
      return;
    }

    await handleAddToCart();
    navigate('/cart');
  };

  const calculateTotalPrice = () => {
    return (currentPrice * quantity).toFixed(2);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="text-center">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
              style={{ borderColor: '#A79277' }}
            ></div>
            <p className="mt-4 font-medium" style={{ color: '#A79277' }}>Loading product details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="text-center p-8 rounded-xl shadow-sm" style={{ backgroundColor: '#EAD8C0', border: '1px solid #D1BB9E' }}>
            <p className="mb-4 font-medium" style={{ color: '#5A4638' }}>
              {error || 'Product not found'}
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
            >
              Back to Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const basePrice = parseFloat(product.price) || 0;

  return (
    <>
      {toast.show && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-sm hover:underline" style={{ color: '#A79277' }}>
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2" style={{ color: '#D1BB9E' }}>/</span>
                </li>
                <li>
                  <Link to="/products" className="text-sm hover:underline" style={{ color: '#A79277' }}>
                    Products
                  </Link>
                </li>
                <li>
                  <span className="mx-2" style={{ color: '#D1BB9E' }}>/</span>
                </li>
                <li className="text-sm truncate" style={{ color: '#5A4638' }}>
                  {product.name}
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                <img 
                  src={`http://localhost:5173/${product?.image}`} 
                  alt={product.name}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x600?text=Image+Not+Found";
                  }}
                />
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold" style={{ color: '#5A4638' }}>
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-3xl font-bold" style={{ color: '#A79277' }}>
                      ₹{currentPrice.toFixed(2)}
                    </span>
                  </div>
                  {product.collection && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: '#EAD8C0', color: '#5A4638' }}>
                      {product.collection}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5A4638' }}>Description</h3>
                  <p className="leading-relaxed" style={{ color: '#8B7355' }}>
                    {product.description || 'Experience the luxury of Zyraé perfumes. Crafted with premium ingredients for long-lasting fragrance that captivates the senses.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#5A4638' }}>Select Size</h3>
                  <div className="flex space-x-4">
                    {sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                            isSelected ? 'border-2' : 'border'
                          }`}
                          style={{
                            backgroundColor: isSelected ? '#A79277' : '#FFF2E1',
                            color: isSelected ? '#FFF2E1' : '#5A4638',
                            borderColor: isSelected ? '#8B7355' : '#D1BB9E'
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#5A4638' }}>Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition duration-200 hover:opacity-90"
                      style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
                    >
                      -
                    </button>
                    <span className="text-xl font-medium px-6 py-2 rounded" style={{ backgroundColor: '#FFF2E1', border: '1px solid #D1BB9E', color: '#5A4638', minWidth: '4rem', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition duration-200 hover:opacity-90"
                      style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm" style={{ color: '#8B7355' }}>
                      Total for {quantity} item{quantity > 1 ? 's' : ''}: 
                      <span className="font-semibold ml-2" style={{ color: '#5A4638' }}>
                        ₹{calculateTotalPrice()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 py-4 px-6 rounded-lg font-medium text-lg transition duration-200 disabled:opacity-50 flex items-center justify-center hover:opacity-90"
                      style={{ 
                        backgroundColor: '#A79277',
                        color: '#FFF2E1',
                        border: '1px solid #8B7355'
                      }}
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    
                    <button
                      onClick={handleWishlistToggle}
                      disabled={addingToWishlist}
                      className="p-4 rounded-lg transition duration-200 disabled:opacity-50 hover:opacity-90"
                      style={{ 
                        backgroundColor: '#FFF2E1',
                        border: '1px solid #D1BB9E',
                        color: isInWishlist(product.id) ? '#EF5350' : '#5A4638'
                      }}
                    >
                      {isInWishlist(product.id) ? (
                        <HeartIconFilled className="w-6 h-6" />
                      ) : (
                        <HeartIconOutline className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="w-full py-4 px-6 rounded-lg font-medium text-lg transition duration-200 disabled:opacity-50 hover:opacity-90"
                    style={{ 
                      backgroundColor: '#5A4638',
                      color: '#FFF2E1',
                      border: '1px solid #5A4638'
                    }}
                  >
                    Buy Now (₹{calculateTotalPrice()})
                  </button>
                </div>

                <div className="pt-6 border-t" style={{ borderColor: '#D1BB9E' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#5A4638' }}>Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Selected Size</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>{selectedSize}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Price per ml</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>
                        ₹{(currentPrice / parseInt(selectedSize)).toFixed(2)}/ml
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Fragrance Type</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>Eau de Parfum</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Gender</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>Unisex</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Longevity</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>8-10 hours</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#8B7355' }}>Occasion</p>
                      <p className="font-medium" style={{ color: '#5A4638' }}>All Day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </>
  );
};

export default ProductDetails;