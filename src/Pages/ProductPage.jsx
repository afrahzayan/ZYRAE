import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import Navbar from '../component/navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';
import { useAuth } from '../context/authContext';

const HeartIconOutline = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const HeartIconFilled = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ShoppingBagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#10B981' : '#EF4444';

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>

        <span className="font-medium">{message}</span>

        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const navigate = useNavigate();

  const { user } = useAuth();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [addingToCart, setAddingToCart] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get('/product', {
        params: {
          page,
          limit: 8
        }
      });

      if (response.data && response.data.products) {
        const formattedProducts = response.data.products.map((product) => ({
          ...product,
          _id: product.id || product._id,
          id: product.id || product._id,
        }));

        setProducts(formattedProducts);
        setTotalPages(response.data.totalPages);
      } else {
        setProducts([]);
      }

      setError(null);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (product.stock === 0) {
      showToast('This product is out of stock', 'error');
      return;
    }

    if (!user) {
      navigate('/login', {
        state: { message: 'Please login to add items to cart' },
      });
      return;
    }

    const productKey = product._id || product.id;

    setAddingToCart((prev) => ({
      ...prev,
      [productKey]: true,
    }));

    try {
      const productForCart = {
        productId: product._id || product.id,
        _id: product._id || product.id,
        id: product.id || product._id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image: product.image,
        description: product.description,
      };

      const success = await addToCart(productForCart);

      if (success) {
        showToast(`${product.name} added to cart successfully!`, 'success');
      } else {
        showToast('Failed to add item to cart. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setAddingToCart((prev) => ({
        ...prev,
        [productKey]: false,
      }));
    }
  };

  const handleWishlistClick = async (e, product) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login', {
        state: { message: 'Please login to add items to wishlist' },
      });
      return;
    }

    setAddingToWishlist((prev) => ({
      ...prev,
      [product._id]: true,
    }));

    try {
      const productForWishlist = {
        id: product._id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image: product.image,
        description: product.description || '',
      };

      const currentlyInWishlist = isInWishlist(product._id);

      if (currentlyInWishlist) {
        const success = await removeFromWishlist(product._id);

        if (success) {
          showToast(`${product.name} removed from wishlist`, 'success');
        } else {
          showToast('Failed to remove from wishlist', 'error');
        }
      } else {
        const success = await addToWishlist(productForWishlist);

        if (success) {
          showToast(`${product.name} added to wishlist!`, 'success');
        } else {
          showToast('Failed to add to wishlist', 'error');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('Failed to update wishlist. Please try again.', 'error');
    } finally {
      setAddingToWishlist((prev) => ({
        ...prev,
        [product._id]: false,
      }));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#FFF2E1' }}
        >
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: '#A79277' }}
            ></div>

            <p
              className="mt-4 font-medium"
              style={{ color: '#A79277' }}
            >
              Loading products...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#FFF2E1' }}
        >
          <div
            className="text-center p-8 rounded-xl shadow-sm"
            style={{
              backgroundColor: '#EAD8C0',
              border: '1px solid #D1BB9E',
            }}
          >
            <p
              className="mb-4 font-medium"
              style={{ color: '#5A4638' }}
            >
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({
              ...toast,
              show: false,
            })
          }
        />
      )}

      <Navbar />

      <div
        className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto"
        style={{ backgroundColor: '#FFF2E1' }}
      >
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: '#5A4638' }}
          >
            Our Products
          </h1>

          <p
            className="text-lg"
            style={{ color: '#A79277' }}
          >
            Discover amazing perfumes curated just for you
          </p>
        </div>

        <div className="mb-6">
          <p
            className="font-medium"
            style={{ color: '#A79277' }}
          >
            Showing {products.length} product
            {products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="text-lg mb-4 font-medium"
              style={{ color: '#A79277' }}
            >
              No products found in the database.
            </p>

            <button
              onClick={fetchProducts}
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1',
              }}
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card cursor-pointer overflow-hidden transform hover:-translate-y-1 border"
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor: '#EAD8C0',
                }}
                onClick={() => handleProductClick(product._id)}
              >
                <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name || 'Product'}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={(e) => handleWishlistClick(e, product)}
                    disabled={addingToWishlist[product._id]}
                    className="absolute top-2 right-2 rounded-full p-2 shadow-lg hover:bg-opacity-90 transition-all opacity-0 group-hover/card:opacity-100 disabled:opacity-50"
                    style={{ backgroundColor: '#EAD8C0' }}
                  >
                    {isInWishlist(product._id) ? (
                      <HeartIconFilled
                        className="w-5 h-5"
                        style={{ color: '#EF5350' }}
                      />
                    ) : (
                      <HeartIconOutline
                        className="w-5 h-5"
                        style={{ color: '#A79277' }}
                      />
                    )}
                  </button>

                  {/* COLLECTION BADGE - Top Left */}
                  {product.collection && (
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: '#5A4638',
                          color: '#FFF2E1'
                        }}
                      >
                        {product.collection.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Buttons Container - Left side for Out of Stock badge, Right side for Add to Cart */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center">
                    {/* OUT OF STOCK BADGE */}
                    {product.stock === 0 && (
                      <div className="z-10">
                        <span
                          className="px-3 py-1 text-xs font-bold rounded"
                          style={{
                            backgroundColor: '#EF4444',
                            color: 'white',
                          }}
                        >
                          OUT OF STOCK
                        </span>
                      </div>
                    )}

                    {/* ADD TO CART BUTTON */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={
                        addingToCart[product._id] || product.stock === 0
                      }
                      className={`ml-auto px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 flex items-center ${product.stock === 0
                        ? 'opacity-0 group-hover/card:opacity-0'
                        : 'opacity-0 group-hover/card:opacity-100'
                        }`}
                      style={{
                        backgroundColor: '#A79277',
                        color: '#FFF2E1',
                      }}
                    >
                      <ShoppingBagIcon className="w-4 h-4 mr-1" />

                      {addingToCart[product._id]
                        ? 'Adding...'
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="font-semibold text-lg mb-2 truncate"
                    style={{ color: '#5A4638' }}
                  >
                    {product.name || 'Unnamed Product'}
                  </h3>

                  <p
                    className="font-bold text-xl mb-2"
                    style={{ color: '#A79277' }}
                  >
                    ₹
                    {typeof product.price === 'number'
                      ? product.price.toFixed(2)
                      : product.price || '0.00'}
                  </p>

                  {product.description && (
                    <p
                      className="text-sm mb-2 truncate"
                      style={{ color: '#8B7355' }}
                    >
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-6 mt-10">

          {/* LEFT ARROW */}
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
            style={{
              backgroundColor: '#A79277',
              color: '#FFF2E1'
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* PAGE NUMBER */}
          <span
            className="font-semibold text-lg"
            style={{ color: '#5A4638' }}
          >
            {page} / {totalPages}
          </span>

          {/* RIGHT ARROW */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
            style={{
              backgroundColor: '#A79277',
              color: '#FFF2E1'
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

        </div>

        <div
          className="mt-12 p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: '#EAD8C0',
            border: '1px solid #D1BB9E',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: '#5A4638' }}
              >
                Need Help?
              </h3>

              <p style={{ color: '#8B7355' }}>
                Contact us for any questions about our products
              </p>
            </div>

            <button
              className="px-6 py-3 font-medium rounded-lg transition duration-300 hover:opacity-90"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1',
              }}
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition duration-300"
            style={{
              backgroundColor: '#D1BB9E',
              color: '#5A4638',
            }}
          >
            Back to Top
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductPage;