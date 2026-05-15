import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import Dashboard from '../Component/Dashboard';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editForm, setEditForm] = useState({
    name: '',
    collection: '',
    price: '',
    stock: '',
    image: null
  });


  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCollection, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCollection, sortBy, page]);

  useEffect(() => {

    fetchCollections();

  }, []);

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const response = await api.get('/admin/product', {
        params: {
          search: searchTerm,
          collection: selectedCollection,
          sortBy: sortBy,
          page,
          limit: 5
        }
      });

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setCollections(response.data.collections);

    } catch (error) {

      console.error('Error fetching products:', error);

    } finally {

      setLoading(false);

    }
  };

  const fetchCollections = async () => {

    try {

      const response = await api.get('/admin/product/collections');

      setCollections(response.data.collections);

    } catch (error) {

      console.log(error);

    }
  };


  const filteredProducts = products;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/product/delete/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };


  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name || '',
      collection: product.collection || '',
      price: product.price || '',
      stock: product.stock || 0,
      image: null
    });
  };



  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditImageChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };


  const handleSaveEdit = async () => {

    if (!editForm.name || !editForm.price) {
      alert('Name and Price are required');
      return;
    }

    try {

      const formData = new FormData();

      formData.append('name', editForm.name);
      formData.append('collection', editForm.collection);
      formData.append('price', editForm.price);
      formData.append('stock', editForm.stock);

      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await api.put(
        `/admin/product/${editingProduct}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      fetchProducts();

      setEditingProduct(null);

      alert('Product updated successfully!');

    } catch (error) {

      console.error('Error updating product:', error);

      alert('Failed to update product');
    }
  };


  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <Dashboard>
      <div className="space-y-6">

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


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg focus:outline-none"
              style={{
                backgroundColor: '#FFF2E1',
                border: '1px solid #D1BB9E',
                color: '#5A4638'
              }}
            />
          </div>

          {/* COLLECTION FILTER */}
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="px-4 py-3 rounded-lg outline-none"
            style={{
              backgroundColor: '#FFF2E1',
              border: '1px solid #D1BB9E',
              color: '#5A4638'
            }}
          >
            <option value="all">All Collections</option>

            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg outline-none"
            style={{
              backgroundColor: '#FFF2E1',
              border: '1px solid #D1BB9E',
              color: '#5A4638'
            }}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="collection">Collection</option>
          </select>

        </div>


        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mr-3"
              style={{ borderColor: '#A79277' }}
            ></div>
            <p className="font-medium" style={{ color: '#A79277' }}>Loading products...</p>
          </div>
        ) : (

          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#D1BB9E' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#EAD8C0' }}>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Product</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Collection</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Price</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Stock</th>
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
                      <React.Fragment key={product._id}>

                        <tr
                          className="border-b hover:bg-white transition-colors"
                          style={{ borderColor: '#EAD8C0' }}
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'}
                                />
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: '#5A4638' }}>{product.name}</p>
                                <p className="text-sm" style={{ color: '#8B7355' }}>ID: {product._id}</p>
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
                            {product.stock > 0 ? (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: '#E8F5E9',
                                  color: '#2E7D32'
                                }}
                              >
                                {product.stock} In Stock
                              </span>
                            ) : (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: '#FFEBEE',
                                  color: '#D32F2F'
                                }}
                              >
                                Out of Stock
                              </span>
                            )}
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
                                onClick={() => handleDelete(product._id)}
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


                        {editingProduct === product._id && (
                          <tr className="border-b" style={{ borderColor: '#EAD8C0' }}>
                            <td colSpan="5" className="p-4">
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
                                    <label
                                      className="block text-xs font-medium mb-1"
                                      style={{ color: '#5A4638' }}
                                    >
                                      Collection
                                    </label>

                                    <select
                                      name="collection"
                                      value={editForm.collection}
                                      onChange={handleEditChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    >
                                      <option value="Floral">Floral</option>
                                      <option value="Woody">Woody</option>
                                      <option value="Citrus">Citrus</option>
                                      <option value="Oriental">Oriental</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1"
                                      style={{ color: '#5A4638' }}
                                    >
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
                                    <label
                                      className="block text-xs font-medium mb-1"
                                      style={{ color: '#5A4638' }}
                                    >
                                      Product Image
                                    </label>

                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleEditImageChange}
                                      className="w-full px-2 py-1 text-sm rounded border"
                                      style={{
                                        backgroundColor: 'white',
                                        borderColor: '#D1BB9E',
                                        color: '#5A4638'
                                      }}
                                    />
                                  </div>

                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-1"
                                      style={{ color: '#5A4638' }}
                                    >
                                      Stock
                                    </label>

                                    <input
                                      type="number"
                                      name="stock"
                                      value={editForm.stock}
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
              <div className="flex justify-center items-center gap-3 mt-6">

                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="px-4 py-2 rounded disabled:opacity-50"
                  style={{
                    backgroundColor: '#A79277',
                    color: '#FFF2E1'
                  }}
                >
                  Previous
                </button>

                <span
                  className="font-medium"
                  style={{ color: '#5A4638' }}
                >
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 rounded disabled:opacity-50"
                  style={{
                    backgroundColor: '#A79277',
                    color: '#FFF2E1'
                  }}
                >
                  Next
                </button>

              </div>
            </div>
          </div>
        )}


        <div className="text-sm" style={{ color: '#8B7355' }}>
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </Dashboard>
  );
};

export default ProductsManagement;