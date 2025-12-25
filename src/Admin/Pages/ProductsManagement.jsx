import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import Dashboard from '../Component/Dashboard';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    collection: '',
    price: '',
    image: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.collection?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name || '',
      collection: product.collection || '',
      price: product.price || '',
      image: product.image || ''
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.price) {
      alert('Name and Price are required');
      return;
    }

    try {
      await api.put(`/products/${editingProduct}`, editForm);
      fetchProducts(); // Refresh the list
      setEditingProduct(null); // Close edit modal
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#5A4638' }}>Products Management</h2>
            <p className="text-sm" style={{ color: '#8B7355' }}>
              Manage your perfume products
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/products/add'}
            className="px-4 py-2 rounded-lg font-medium transition duration-200"
            style={{ 
              backgroundColor: '#A79277',
              color: '#FFF2E1',
              border: '1px solid #8B7355'
            }}
          >
            Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none"
            style={{ 
              backgroundColor: '#FFF2E1',
              border: '1px solid #D1BB9E',
              color: '#5A4638'
            }}
          />
          <svg 
            className="absolute right-3 top-3 w-5 h-5"
            style={{ color: '#A79277' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div 
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mr-3" 
              style={{ borderColor: '#A79277' }}
            ></div>
            <p className="font-medium" style={{ color: '#A79277' }}>Loading products...</p>
          </div>
        ) : (
          /* Products Table */
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#D1BB9E' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#EAD8C0' }}>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Product</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Collection</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Price</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center" style={{ color: '#8B7355' }}>
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <React.Fragment key={product.id}>
                        {/* Product Row */}
                        <tr 
                          className="border-b hover:bg-white transition-colors"
                          style={{ borderColor: '#EAD8C0' }}
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded overflow-hidden">
                                <img 
                                  src={`http://localhost:5173/${product.image}`} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'}
                                />
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: '#5A4638' }}>{product.name}</p>
                                <p className="text-sm" style={{ color: '#8B7355' }}>ID: {product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span 
                              className="px-2 py-1 text-xs rounded"
                              style={{ backgroundColor: '#FFF2E1', color: '#5A4638', border: '1px solid #D1BB9E' }}
                            >
                              {product.collection || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 font-medium" style={{ color: '#A79277' }}>
                            ₹{product.price || '0.00'}
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="px-3 py-1 text-sm rounded transition duration-200"
                                style={{ 
                                  backgroundColor: '#A79277',
                                  color: '#FFF2E1'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-1 text-sm rounded transition duration-200"
                                style={{ 
                                  backgroundColor: '#FFEBEE',
                                  color: '#EF5350',
                                  border: '1px solid #EF5350'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Edit Form Row - Appears below the product being edited */}
                        {editingProduct === product.id && (
                          <tr className="border-b" style={{ borderColor: '#EAD8C0' }}>
                            <td colSpan="4" className="p-4">
                              <div className="bg-white p-4 rounded-lg border" style={{ 
                                backgroundColor: '#FFFCF5',
                                borderColor: '#D1BB9E'
                              }}>
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold" style={{ color: '#5A4638' }}>Edit Product</h4>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-sm"
                                    style={{ color: '#8B7355' }}
                                  >
                                    ✕ Close
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: '#5A4638' }}>
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={editForm.name}
                                      onChange={handleEditChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{ 
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: '#5A4638' }}>
                                      Collection
                                    </label>
                                    <input
                                      type="text"
                                      name="collection"
                                      value={editForm.collection}
                                      onChange={handleEditChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{ 
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: '#5A4638' }}>
                                      Price
                                    </label>
                                    <input
                                      type="number"
                                      name="price"
                                      value={editForm.price}
                                      onChange={handleEditChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{ 
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium mb-1" style={{ color: '#5A4638' }}>
                                      Image URL
                                    </label>
                                    <input
                                      type="text"
                                      name="image"
                                      value={editForm.image}
                                      onChange={handleEditChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{ 
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex justify-end space-x-2 mt-3 pt-3 border-t" style={{ borderColor: '#D1BB9E' }}>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 text-sm rounded border"
                                    style={{ 
                                      backgroundColor: '#FFF2E1',
                                      borderColor: '#D1BB9E',
                                      color: '#5A4638'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="px-3 py-1 text-sm rounded"
                                    style={{ 
                                      backgroundColor: '#A79277',
                                      color: '#FFF2E1'
                                    }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm" style={{ color: '#8B7355' }}>
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </Dashboard>
  );
};

export default ProductsManagement;