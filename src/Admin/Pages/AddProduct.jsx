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
    image: null,
    stock: 10,
    featured: false,

  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // HANDLE IMAGE CHANGE
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.collection ||
      !formData.size ||
      !formData.image
    ) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

      const productData = new FormData();

      productData.append('name', formData.name);
      productData.append('collection', formData.collection);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('size', formData.size);
      productData.append('fragranceNotes', formData.fragranceNotes);
      productData.append('stock', formData.stock);
      productData.append('featured', formData.featured);
      productData.append('image', formData.image);

      await api.post('/admin/product', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Product added successfully!');

      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const collections = ['Floral', 'Woody', 'Citrus', 'Oriental'];

  return (
    <Dashboard>
      <div className="max-w-5xl mx-auto py-6 px-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: '#5A4638' }}
            >
              Add Product
            </h1>

            <p
              className="text-sm mt-1"
              style={{ color: '#8B7355' }}
            >
              Create a new perfume product
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 rounded-lg border transition"
            style={{
              borderColor: '#D1BB9E',
              backgroundColor: '#FFF2E1',
              color: '#5A4638'
            }}
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* BASIC INFO */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: '#FFF2E1',
              borderColor: '#D1BB9E'
            }}
          >
            <h2
              className="text-xl font-semibold mb-5"
              style={{ color: '#5A4638' }}
            >
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* PRODUCT NAME */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                />
              </div>

              {/* COLLECTION */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Collection *
                </label>

                <select
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
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

              {/* PRICE */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Price *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹ 0.00"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                />
              </div>

              
              {/* SIZE */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Size
                </label>

                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                >
                  
                  <option value="50ml">50ml</option>
                  <option value="100ml">100ml</option>
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#5A4638' }}
              >
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Write product description..."
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: '#FFFCF5',
                  border: '1px solid #D1BB9E',
                  color: '#5A4638'
                }}
              />
            </div>

            {/* NOTES */}
            <div className="mt-5">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#5A4638' }}
              >
                Fragrance Notes
              </label>

              <textarea
                name="fragranceNotes"
                value={formData.fragranceNotes}
                onChange={handleChange}
                rows="3"
                placeholder="Top, middle and base notes..."
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: '#FFFCF5',
                  border: '1px solid #D1BB9E',
                  color: '#5A4638'
                }}
              />
            </div>
          </div>

          {/* MEDIA & INVENTORY */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: '#FFF2E1',
              borderColor: '#D1BB9E'
            }}
          >
            <h2
              className="text-xl font-semibold mb-5"
              style={{ color: '#5A4638' }}
            >
              Media & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* IMAGE */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Product Image *
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                />
              </div>

              {/* STOCK */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#5A4638' }}
                >
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#FFFCF5',
                    border: '1px solid #D1BB9E',
                    color: '#5A4638'
                  }}
                />
              </div>


            </div>

            {/* FEATURED */}
            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4"
                style={{
                  accentColor: '#A79277'
                }}
              />

              <label
                className="text-sm"
                style={{ color: '#5A4638' }}
              >
                Featured Product
              </label>
            </div>

            {/* IMAGE PREVIEW */}
            {formData.image && (
              <div className="mt-6">
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: '#5A4638' }}
                >
                  Image Preview
                </h3>

                <div
                  className="w-52 h-52 rounded-xl overflow-hidden border"
                  style={{ borderColor: '#D1BB9E' }}
                >
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 rounded-xl border"
              style={{
                backgroundColor: '#FFF2E1',
                borderColor: '#D1BB9E',
                color: '#5A4638'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-medium disabled:opacity-50"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1'
              }}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default AddProduct;