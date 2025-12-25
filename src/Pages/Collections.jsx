
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const ShoppingBagIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Collections = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});

  
  const collectionDisplayNames = {
    floral: 'Floral Perfumes',
    woody: 'Woody Scents',
    citrus: 'Citrus Fragrances',
    oriental: 'Oriental Blends'
  };

  
  const collectionDescriptions = {
    floral: 'Delicate and romantic scents inspired by nature\'s most beautiful flowers. Perfect for everyday elegance.',
    woody: 'Warm and earthy fragrances with notes of sandalwood, cedar, and vetiver. Ideal for sophisticated evenings.',
    citrus: 'Fresh and invigorating scents with zesty notes of lemon, orange, and bergamot. Great for daytime energy.',
    oriental: 'Exotic and sensual blends with spices, amber, and musk. Perfect for special occasions.'
  };

  
  useEffect(() => {
    fetchProductsByCollection();
  }, [collectionName]);

  const fetchProductsByCollection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/products');
      const allProducts = response.data;
      
      
      const filteredProducts = allProducts.filter(product => 
        product.collection && product.collection.toLowerCase() === collectionName.toLowerCase()
      );
      
      setProducts(filteredProducts);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load collection products. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { message: 'Please login to add items to cart' } });
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const productForCart = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image: product.image
      };
      
      await addToCart(productForCart);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };


  const handleWishlistClick = async (e, product) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { message: 'Please login to add items to wishlist' } });
      return;
    }

    setAddingToWishlist(prev => ({ ...prev, [product.id]: true }));
    
    try {
      if (isInWishlist(product.id)) {
        
        const wishlistResponse = await api.get('/wishlist');
        const wishlistItem = wishlistResponse.data.find(item => item.productId === product.id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
      } else {
        
        const productForWishlist = {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          image: product.image
        };
        await addToWishlist(productForWishlist);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setAddingToWishlist(prev => ({ ...prev, [product.id]: false }));
    }
  };

  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
            <p className="mt-4 font-medium" style={{ color: '#A79277' }}>Loading collection...</p>
          </div>
        </div>
      </>
    );
  }

  
  if (error || !collectionName) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="text-center p-8 rounded-xl shadow-sm" style={{ backgroundColor: '#EAD8C0', border: '1px solid #D1BB9E' }}>
            <p className="mb-4 font-medium" style={{ color: '#5A4638' }}>
              {error || 'Collection not found'}
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

  return (
    <>
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
                <li className="text-sm font-medium" style={{ color: '#5A4638' }}>
                  {collectionDisplayNames[collectionName] || collectionName}
                </li>
              </ol>
            </nav>
          </div>

        
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#5A4638' }}>
              {collectionDisplayNames[collectionName] || collectionName}
            </h1>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#8B7355' }}>
              {collectionDescriptions[collectionName] || 'Discover our curated collection of premium fragrances.'}
            </p>
            <p className="text-sm mt-2" style={{ color: '#A79277' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'} in this collection
            </p>
          </div>

          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4 font-medium" style={{ color: '#A79277' }}>
                No products found in this collection.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
                style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card cursor-pointer overflow-hidden transform hover:-translate-y-1 border"
                  style={{ backgroundColor: '#FFF2E1', borderColor: '#EAD8C0' }}
                  onClick={() => handleProductClick(product.id)}
                >
                  
                  <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
                    <img 
                      src={`http://localhost:5173/${product?.image}`} 
                      alt={product.name || "Product"}
                      className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
                      }}
                    />
                    
                    
                    <button 
                      onClick={(e) => handleWishlistClick(e, product)}
                      disabled={addingToWishlist[product.id]}
                      className="absolute top-2 right-2 rounded-full p-2 shadow-lg hover:bg-opacity-90 transition-all opacity-0 group-hover/card:opacity-100 disabled:opacity-50"
                      style={{ backgroundColor: '#EAD8C0' }}
                    >
                      {isInWishlist(product.id) ? (
                        <HeartIconFilled className="w-5 h-5" style={{ color: '#EF5350' }} />
                      ) : (
                        <HeartIconOutline className="w-5 h-5" style={{ color: '#A79277' }} />
                      )}
                    </button>

                    
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingToCart[product.id]}
                      className="absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:opacity-90 disabled:opacity-50 flex items-center"
                      style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
                    >
                      <ShoppingBagIcon className="w-4 h-4 mr-1" />
                      {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>

                
                  <div className="p-4">
                  
                    <h3 className="font-semibold text-lg mb-2 truncate" style={{ color: '#5A4638' }}>
                      {product.name || "Unnamed Product"}
                    </h3>
                    
                
                    <p className="font-bold text-xl mb-2" style={{ color: '#A79277' }}>
                      ₹{typeof product.price === 'number' ? product.price.toFixed(2) : (product.price || "0.00")}
                    </p>

                    
                    <div className="mt-2">
                      <span className="inline-block text-xs px-2 py-1 rounded" style={{ backgroundColor: '#EAD8C0', color: '#5A4638' }}>
                        {collectionDisplayNames[product.collection] || product.collection}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          
          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: '#FFF9F0', border: '1px solid #D1BB9E' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4" style={{ color: '#5A4638' }}>About This Collection</h3>
                <p style={{ color: '#8B7355' }}>
                  Each fragrance in our {collectionDisplayNames[collectionName]} collection is carefully crafted 
                  using premium ingredients to create a unique olfactory experience. Our perfumes are 
                  designed to evoke emotions and memories through their distinctive scent profiles.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4" style={{ color: '#5A4638' }}>Scent Notes</h3>
                <ul className="space-y-2" style={{ color: '#8B7355' }}>
                  {collectionName === 'floral' && (
                    <>
                      <li>• Top Notes: Rose, Jasmine, Lily</li>
                      <li>• Middle Notes: Violet, Peony, Iris</li>
                      <li>• Base Notes: Musk, Amber, Vanilla</li>
                    </>
                  )}
                  {collectionName === 'woody' && (
                    <>
                      <li>• Top Notes: Cedar, Sandalwood, Patchouli</li>
                      <li>• Middle Notes: Vetiver, Oakmoss, Amberwood</li>
                      <li>• Base Notes: Leather, Musk, Tonka Bean</li>
                    </>
                  )}
                  {collectionName === 'citrus' && (
                    <>
                      <li>• Top Notes: Lemon, Orange, Bergamot</li>
                      <li>• Middle Notes: Grapefruit, Lime, Mandarin</li>
                      <li>• Base Notes: Neroli, Petitgrain, Musk</li>
                    </>
                  )}
                  {collectionName === 'oriental' && (
                    <>
                      <li>• Top Notes: Cinnamon, Cardamom, Saffron</li>
                      <li>• Middle Notes: Amber, Oud, Frankincense</li>
                      <li>• Base Notes: Vanilla, Labdanum, Myrrh</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          
          <div className="mt-8 text-center">
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
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;