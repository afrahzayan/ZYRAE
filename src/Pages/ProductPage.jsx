// ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch products when component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const searchQuery = searchParams.get('search');

    if (searchQuery && products.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchParams, products]);

  // Function to fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Add to Cart (temporary)
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    alert(`Added ${product.name} to cart!`);
    // Will implement actual cart logic later
  };

  // Handle Wishlist toggle (temporary)
  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    alert(`Added ${product.name} to wishlist!`);
    // Will implement actual wishlist logic later
  };

  // Handle product card click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Loading state
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
            <p className="mt-4 font-medium" style={{ color: '#A79277' }}>Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="text-center p-8 rounded-xl shadow-sm" style={{ backgroundColor: '#EAD8C0', border: '1px solid #D1BB9E' }}>
            <p className="mb-4 font-medium" style={{ color: '#5A4638' }}>{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
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
      <Navbar />
      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto" style={{ backgroundColor: '#FFF2E1' }}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#5A4638' }}>Our Products</h1>
          <p className="text-lg" style={{ color: '#A79277' }}>Discover amazing products curated just for you</p>
        </div>

        {/* Search Results Info */}
        {searchParams.get('search') && (
          <div className="mb-6 p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#EAD8C0', border: '1px solid #D1BB9E' }}>
            <p className="font-medium" style={{ color: '#5A4638' }}>
              Showing results for: "{searchParams.get('search')}"
              {filteredProducts.length === 0 && ' - No products found'}
            </p>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          <p className="font-medium" style={{ color: '#A79277' }}>
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4 font-medium" style={{ color: '#A79277' }}>No products found in the database.</p>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 font-medium rounded-lg hover:opacity-90 transition duration-300"
              style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card cursor-pointer overflow-hidden transform hover:-translate-y-1 border"
                style={{ backgroundColor: '#FFF2E1', borderColor: '#EAD8C0' }}
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
                  <img 
                    src={product.image || "https://via.placeholder.com/300x300?text=No+Image"} 
                    alt={product.name || "Product"}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
                    }}
                  />
                  
                  {/* Wishlist Button (Temporary) */}
                  <button 
                    onClick={(e) => handleWishlistClick(e, product)}
                    className="absolute top-2 right-2 rounded-full p-2 shadow-lg hover:bg-opacity-90 transition-all opacity-0 group-hover/card:opacity-100"
                    style={{ backgroundColor: '#EAD8C0' }}
                  >
                    <svg 
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: '#A79277' }}
                    >
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Quick Add Button (Temporary) */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:opacity-90"
                    style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
                  >
                    + Quick add
                  </button>

                  {/* Category Badge */}
                  {product.collection && (
                    <div className="absolute top-2 left-2">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{ backgroundColor: '#5A4638', color: '#FFF2E1' }}
                      >
                        {product.collection.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 truncate" style={{ color: '#5A4638' }}>
                    {product.name || "Unnamed Product"}
                  </h3>
                  
                  {/* Product Price */}
                  <p className="font-bold text-xl mb-2" style={{ color: '#A79277' }}>
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : (product.price || "0.00")}
                  </p>

                  {/* Product Description (if available) */}
                  {product.description && (
                    <p className="text-sm mb-2 truncate" style={{ color: '#8B7355' }}>
                      {product.description}
                    </p>
                  )}

                  {/* Category Tag */}
                  {product.category && (
                    <span className="inline-block text-xs px-2 py-1 rounded mt-2" style={{ backgroundColor: '#EAD8C0', color: '#5A4638' }}>
                      {product.category.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#EAD8C0', border: '1px solid #D1BB9E' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#5A4638' }}>Need Help?</h3>
              <p style={{ color: '#8B7355' }}>Contact us for any questions about our products</p>
            </div>
            <button 
              className="px-6 py-3 font-medium rounded-lg transition duration-300 hover:opacity-90"
              style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Empty State for search results */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-8">
            <p className="font-medium" style={{ color: '#A79277' }}>
              No products found matching your search
            </p>
          </div>
        )}

        {/* Back to top button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition duration-300"
            style={{ backgroundColor: '#D1BB9E', color: '#5A4638' }}
          >
            Back to Top
          </button>
        </div>
      </div>

      {/* Global Styles for consistent text colors */}
      <style jsx global>{`
        body {
          color: #5A4638;
          background-color: #FFF2E1;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #EAD8C0;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #A79277;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #8B7355;
        }
      `}</style>
    </>
  );
};

export default ProductPage;