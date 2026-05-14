import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';

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
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#10B981' : '#EF4444';

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideIn">
      <div
        className="flex items-center p-4 rounded-lg shadow-lg text-white"
        style={{ backgroundColor: bgColor }}
      >
        <span>{message}</span>

        <button onClick={onClose} className="ml-4">
          ✕
        </button>
      </div>
    </div>
  );
};

const Collections = () => {
  const { collectionName } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [addingToCart, setAddingToCart] = useState({});

  const [addingToWishlist, setAddingToWishlist] = useState({});

  const collectionDisplayNames = {
    floral: 'Floral Perfumes',
    woody: 'Woody Scents',
    citrus: 'Citrus Fragrances',
    oriental: 'Oriental Blends',
  };

  const collectionDescriptions = {
    floral:
      "Delicate and romantic scents inspired by nature's most beautiful flowers. Perfect for everyday elegance.",

    woody:
      'Warm and earthy fragrances with notes of sandalwood, cedar, and vetiver. Ideal for sophisticated evenings.',

    citrus:
      'Fresh and invigorating scents with zesty notes of lemon, orange, and bergamot. Great for daytime energy.',

    oriental:
      'Exotic and sensual blends with spices, amber, and musk. Perfect for special occasions.',
  };

  useEffect(() => {
    fetchProductsByCollection();
  }, [collectionName]);

 const fetchProductsByCollection = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.get(
      `/product?collection=${collectionName}`
    );

    console.log('Collection Products:', response.data);

    if (response.data && response.data.products) {

      const formattedProducts =
        response.data.products.map((product) => ({
          ...product,

          _id: product.id || product._id,
          id: product.id || product._id,
        }));

      setProducts(formattedProducts);

    } else {
      setProducts([]);
    }

  } catch (err) {
    console.error(
      'Error fetching products by collection:',
      err
    );

    setError(
      'Failed to load collection products. Please try again.'
    );

  } finally {
    setLoading(false);
  }
};

  const showToast = (
    message,
    type = 'success'
  ) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const handleAddToCart = async (
    e,
    product
  ) => {
    e.stopPropagation();

    // OUT OF STOCK CHECK
    if (product.stock === 0) {
      showToast(
        'This product is out of stock',
        'error'
      );

      return;
    }

    if (!user) {
      navigate('/login', {
        state: {
          message:
            'Please login to add items to cart',
        },
      });

      return;
    }

    setAddingToCart((prev) => ({
      ...prev,
      [product._id]: true,
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

      const success = await addToCart(
        productForCart
      );

      if (success) {
        showToast(
          `${product.name} added to cart successfully!`,
          'success'
        );
      } else {
        showToast(
          'Failed to add item to cart. Please try again.',
          'error'
        );
      }
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error
      );

      showToast(
        'An error occurred. Please try again.',
        'error'
      );
    } finally {
      setAddingToCart((prev) => ({
        ...prev,
        [product._id]: false,
      }));
    }
  };

  const handleWishlistClick = async (
    e,
    product
  ) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login', {
        state: {
          message:
            'Please login to add items to wishlist',
        },
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
        description:
          product.description || '',
      };

      if (isInWishlist(product._id)) {
        const success =
          await removeFromWishlist(product._id);

        if (success) {
          showToast(
            `${product.name} removed from wishlist`,
            'success'
          );
        }
      } else {
        const success =
          await addToWishlist(productForWishlist);

        if (success) {
          showToast(
            `${product.name} added to wishlist!`,
            'success'
          );
        }
      }
    } catch (error) {
      console.error(
        'Error toggling wishlist:',
        error
      );

      showToast(
        'Failed to update wishlist',
        'error'
      );
    } finally {
      setAddingToWishlist((prev) => ({
        ...prev,
        [product._id]: false,
      }));
    }
  };

  const handleProductClick = (
    productId
  ) => {
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
              Loading collection...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !collectionName) {
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
              {error || 'Collection not found'}
            </p>

            <button
              onClick={() =>
                navigate('/products')
              }
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1',
              }}
            >
              Back to Products
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
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}

      <Navbar />

      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FFF2E1' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: '#5A4638' }}
            >
              {collectionDisplayNames[
                collectionName
              ] || collectionName}
            </h1>

            <p
              className="text-lg max-w-3xl mx-auto"
              style={{ color: '#8B7355' }}
            >
              {collectionDescriptions[
                collectionName
              ] ||
                'Discover our curated collection of premium fragrances.'}
            </p>
          </div>

          {/* PRODUCTS */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-lg mb-4 font-medium"
                style={{ color: '#A79277' }}
              >
                No products found in this collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card cursor-pointer overflow-hidden transform hover:-translate-y-1 border"
                  style={{
                    backgroundColor: '#FFF2E1',
                    borderColor: '#EAD8C0',
                  }}
                  onClick={() =>
                    handleProductClick(product._id || product.id)
                  }
                >
                  <div className="relative overflow-hidden rounded-t-xl bg-gray-50">

                    <img
                      src={product.image}
                      alt={
                        product.name ||
                        'Product'
                      }
                      className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/300x300?text=Image+Not+Found';
                      }}
                    />

                    {/* WISHLIST BUTTON */}
                    <button
                      onClick={(e) =>
                        handleWishlistClick(
                          e,
                          product
                        )
                      }
                      disabled={
                        addingToWishlist[
                          product._id
                        ]
                      }
                      className="absolute top-2 right-2 rounded-full p-2 shadow-lg hover:bg-opacity-90 transition-all opacity-0 group-hover/card:opacity-100 disabled:opacity-50"
                      style={{
                        backgroundColor:
                          '#EAD8C0',
                      }}
                    >
                      {isInWishlist(
                        product._id
                      ) ? (
                        <HeartIconFilled
                          className="w-5 h-5"
                          style={{
                            color: '#EF5350',
                          }}
                        />
                      ) : (
                        <HeartIconOutline
                          className="w-5 h-5"
                          style={{
                            color: '#A79277',
                          }}
                        />
                      )}
                    </button>

                    {/* COLLECTION BADGE */}
                    {product.collection && (
                      <div className="absolute top-2 left-2">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded"
                          style={{
                            backgroundColor:
                              '#5A4638',
                            color: '#FFF2E1',
                          }}
                        >
                          {product.collection.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* BOTTOM CONTAINER */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center">

                      {/* OUT OF STOCK */}
                      {product.stock === 0 && (
                        <div className="z-10">
                          <span
                            className="px-3 py-1 text-xs font-bold rounded"
                            style={{
                              backgroundColor:
                                '#EF4444',
                              color: 'white',
                            }}
                          >
                            OUT OF STOCK
                          </span>
                        </div>
                      )}

                      {/* ADD TO CART */}
                      <button
                        onClick={(e) =>
                          handleAddToCart(
                            e,
                            product
                          )
                        }
                        disabled={
                          addingToCart[
                            product._id
                          ] ||
                          product.stock === 0
                        }
                        className={`ml-auto px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 flex items-center ${
                          product.stock === 0
                            ? 'opacity-0 group-hover/card:opacity-0'
                            : 'opacity-0 group-hover/card:opacity-100'
                        }`}
                        style={{
                          backgroundColor:
                            '#A79277',
                          color: '#FFF2E1',
                        }}
                      >
                        <ShoppingBagIcon className="w-4 h-4 mr-1" />

                        {addingToCart[
                          product._id
                        ]
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
                      {product.name ||
                        'Unnamed Product'}
                    </h3>

                    <p
                      className="font-bold text-xl mb-2"
                      style={{ color: '#A79277' }}
                    >
                      ₹
                      {typeof product.price ===
                      'number'
                        ? product.price.toFixed(
                            2
                          )
                        : product.price ||
                          '0.00'}
                    </p>

                    {product.description && (
                      <p
                        className="text-sm mb-2 line-clamp-2"
                        style={{
                          color: '#8B7355',
                        }}
                      >
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Collections;