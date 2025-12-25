import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../API/Axios';
import Dashboard from '../Component/Dashboard';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    collection: '',
    description: '',
    price: '',
    size: '',
    fragranceNotes: '',
    image: '',
    stock: 10,
    featured: false,
    category: 'perfume'
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.collection) {
      alert('Please fill in all required fields (Name, Price, Collection)');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await api.post('/products', productData);
      
      alert('Product added successfully!');
      navigate('/admin/products');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Collections list for dropdown
  const collections = [
    'Floral',
    'Woody ',
    'Citrus',
    'Oriental'
  ];

  return (
    <Dashboard>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-2 rounded-lg hover:bg-opacity-20 transition duration-200"
              style={{ 
                backgroundColor: '#FFF2E1',
                border: '1px solid #D1BB9E',
                color: '#5A4638'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#5A4638' }}>Add New Product</h2>
              <p className="text-sm" style={{ color: '#8B7355' }}>
                Create a new perfume product
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl border p-6" style={{ 
          backgroundColor: '#FFF2E1',
          borderColor: '#D1BB9E'
        }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2 border-b" style={{ 
                color: '#5A4638',
                borderColor: '#D1BB9E'
              }}>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                    placeholder="Enter product name"
                  />
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Collection *
                  </label>
                  <select
                    name="collection"
                    value={formData.collection}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                  >
                    <option value="">Select Collection</option>
                    {collections.map((collection) => (
                      <option key={collection} value={collection}>
                        {collection}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                    placeholder="0.00"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Size (ml)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                    placeholder="e.g., 50ml, 100ml"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none"
                  style={{ 
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                  placeholder="Enter product description..."
                />
              </div>

              {/* Fragrance Notes */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                  Fragrance Notes
                </label>
                <textarea
                  name="fragranceNotes"
                  value={formData.fragranceNotes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none"
                  style={{ 
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                  placeholder="Top notes: ... | Heart notes: ... | Base notes: ..."
                />
              </div>
            </div>

            {/* Image & Stock */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2 border-b" style={{ 
                color: '#5A4638',
                borderColor: '#D1BB9E'
              }}>
                Media & Inventory
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs mt-1" style={{ color: '#8B7355' }}>
                    Enter the full URL of the product image
                  </p>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#5A4638' }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: '#FFFCF5',
                      border: '1px solid #D1BB9E',
                      color: '#5A4638'
                    }}
                  >
                    <option value="perfume">Perfume</option>
                    <option value="cologne">Cologne</option>
                    <option value="body_mist">Body Mist</option>
                    <option value="diffuser">Diffuser</option>
                  </select>
                </div>
              </div>

              {/* Featured Product */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                  style={{ 
                    accentColor: '#A79277'
                  }}
                />
                <label htmlFor="featured" className="text-sm" style={{ color: '#5A4638' }}>
                  Mark as Featured Product
                </label>
              </div>
            </div>

            {/* Preview Section */}
            {formData.image && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: '#5A4638' }}>
                  Image Preview
                </h3>
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden border" style={{ borderColor: '#D1BB9E' }}>
                    <img
                      src={`http://localhost:5173/${formData.image}`}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/192x192?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t" style={{ borderColor: '#D1BB9E' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 rounded-lg font-medium transition duration-200"
                style={{ 
                  backgroundColor: '#FFF2E1',
                  color: '#5A4638',
                  border: '1px solid #D1BB9E'
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                style={{ 
                  backgroundColor: '#A79277',
                  color: '#FFF2E1',
                  border: '1px solid #8B7355'
                }}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Adding...
                  </span>
                ) : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default AddProduct;