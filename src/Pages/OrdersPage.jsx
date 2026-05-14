import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import { api } from '../API/Axios';
import Navbar from '../Component/Navbar';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchOrders = useCallback(async () => {

    if (!user || hasFetched) return;

    setLoading(true);
    

    try {

      const response = await api.get('/orders');

      setOrders(response.data.data || []);

      setHasFetched(true);

    } catch (error) {

      console.error('Error fetching orders:', error);

    } finally {

      setLoading(false);

    }

  }, [user, hasFetched]);

  useEffect(() => {

    fetchOrders();

  }, [fetchOrders]);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

 const getItemImage = (item) => {

  
  if (item.product?.image) {
    return item.product.image;
  }

  
  return 'https://via.placeholder.com/48x48?text=No+Image';
};

const getItemName = (item) => {

  
  if (item.product?.name) {
    return item.product.name;
  }

  return 'Product Not Available';
};

const getItemPrice = (item) => {

  // populated product price
  if (item.product?.price) {
    return parseFloat(item.product.price);
  }

  return parseFloat(item.price || 0);
};

  // ------------------------------------------------------------------
  // Not Logged In
  // ------------------------------------------------------------------

  if (!user) {
    return (
      <>
        <Navbar />

        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#FFF2E1' }}
        >
          <div
            className="text-center p-8 rounded-xl"
            style={{
              backgroundColor: '#FFF9F0',
              border: '1px solid #D1BB9E',
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: '#5A4638' }}
            >
              Please Login
            </h2>

            <p className="mb-6" style={{ color: '#8B7355' }}>
              Login to view your orders
            </p>

            <Link
              to="/login"
              className="px-6 py-3 rounded-lg font-medium"
              style={{
                backgroundColor: '#A79277',
                color: '#FFF2E1',
              }}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------------------------
  // Main Page
  // ------------------------------------------------------------------

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FFF2E1' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Heading */}
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: '#5A4638' }}
          >
            My Orders
          </h1>

          {/* Loading */}
          {loading ? (

            <div className="text-center py-12">

              <div
                className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                style={{ borderColor: '#A79277' }}
              />

              <p
                className="mt-4"
                style={{ color: '#A79277' }}
              >
                Loading orders...
              </p>

            </div>

          ) : orders.length === 0 ? (

            // ----------------------------------------------------------
            // Empty Orders
            // ----------------------------------------------------------

            <div className="text-center py-12">

              <div
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full"
                style={{ backgroundColor: '#EAD8C0' }}
              >
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="#A79277"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>

              <h3
                className="text-xl font-bold mb-2"
                style={{ color: '#5A4638' }}
              >
                No Orders Yet
              </h3>

              <p
                className="mb-6"
                style={{ color: '#8B7355' }}
              >
                You haven't placed any orders
              </p>

              <Link
                to="/products"
                className="px-6 py-3 rounded-lg font-medium inline-block"
                style={{
                  backgroundColor: '#A79277',
                  color: '#FFF2E1',
                }}
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            // ----------------------------------------------------------
            // Orders List
            // ----------------------------------------------------------

            <div className="space-y-6">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: '#FFF9F0',
                    border: '1px solid #D1BB9E',
                  }}
                >

                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-6">

                    <div>

                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: '#5A4638' }}
                      >
                        Order #{order.orderNumber}
                      </h3>

                      <p
                        className="text-sm"
                        style={{ color: '#8B7355' }}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      <p
                        className="text-sm"
                        style={{ color: '#8B7355' }}
                      >
                        Status:{' '}

                        <span
                          className="font-medium capitalize"
                          style={{
                            color:
                              order.status === 'processing'
                                ? '#F59E0B'
                                : order.status === 'delivered'
                                ? '#10B981'
                                : '#A79277',
                          }}
                        >
                          {order.status}
                        </span>
                      </p>

                    </div>

                    <div className="text-right">

                      <p
                        className="text-lg font-bold"
                        style={{ color: '#A79277' }}
                      >
                        ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                      </p>

                      <p
                        className="text-sm"
                        style={{ color: '#8B7355' }}
                      >
                        Payment: {order.paymentMethod}
                      </p>

                    </div>

                  </div>

                  {/* Order Items */}
                  <div className="mb-6">

                    <h4
                      className="font-bold mb-3"
                      style={{ color: '#5A4638' }}
                    >
                      Items
                    </h4>

                    <div className="space-y-3">

                      {order.items?.map((item, index) => (

                        <div
                          key={index}
                          className="flex items-center"
                        >

                          {/* Product Image */}
                          <div className="w-12 h-12 rounded overflow-hidden mr-3">

                            <img
                              src={getItemImage(item)}
                              alt={getItemName(item)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />

                          </div>

                          {/* Product Details */}
                          <div className="flex-1">

                            <p
                              className="font-medium"
                              style={{ color: '#5A4638' }}
                            >
                              {getItemName(item)}
                            </p>

                            <p
                              className="text-sm"
                              style={{ color: '#8B7355' }}
                            >
                              Qty: {item.quantity} • ₹
                              {getItemPrice(item).toFixed(2)} each
                            </p>

                            {item.size && (
                              <p
                                className="text-xs"
                                style={{ color: '#8B7355' }}
                              >
                                Size: {item.size}
                              </p>
                            )}

                          </div>

                          {/* Total */}
                          <p style={{ color: '#A79277' }}>

                            ₹
                            {(
                              getItemPrice(item) * item.quantity
                            ).toFixed(2)}

                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* Shipping Info */}
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: '#D1BB9E' }}
                  >

                    <h4
                      className="font-bold mb-2"
                      style={{ color: '#5A4638' }}
                    >
                      Shipping Address
                    </h4>

                    <p style={{ color: '#8B7355' }}>
                      {order.shippingAddress}
                    </p>

                    <p style={{ color: '#8B7355' }}>
                      {order.shippingCity},{' '}
                      {order.shippingState}{' '}
                      {order.shippingZip}
                    </p>

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

export default OrdersPage;