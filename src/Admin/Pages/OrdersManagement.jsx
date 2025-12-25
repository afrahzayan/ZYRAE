import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import Dashboard from './../Component/Dashboard';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      const updatedOrder = { ...orderToUpdate, status: newStatus };
      await api.put(`/orders/${orderId}`, updatedOrder);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'processing': return '#F59E0B'; // Yellow
      case 'shipped': return '#3B82F6'; // Blue
      case 'delivered': return '#10B981'; // Green
      case 'cancelled': return '#EF4444'; // Red
      default: return '#8B7355';
    }
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5A4638' }}>Orders Management</h2>
          <p className="text-sm" style={{ color: '#8B7355' }}>
            Manage customer orders and update status
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none"
              style={{ 
                backgroundColor: '#FFF2E1',
                border: '1px solid #D1BB9E',
                color: '#5A4638'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg focus:outline-none"
            style={{ 
              backgroundColor: '#FFF2E1',
              border: '1px solid #D1BB9E',
              color: '#5A4638',
              minWidth: '150px'
            }}
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div 
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mr-3" 
              style={{ borderColor: '#A79277' }}
            ></div>
            <p className="font-medium" style={{ color: '#A79277' }}>Loading orders...</p>
          </div>
        ) : (
          /* Orders Table */
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#D1BB9E' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#EAD8C0' }}>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Order #</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Customer</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Date</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Amount</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Status</th>
                    <th className="p-3 text-left font-medium" style={{ color: '#5A4638' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center" style={{ color: '#8B7355' }}>
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr 
                        key={order.id}
                        className="border-b hover:bg-white transition-colors"
                        style={{ borderColor: '#EAD8C0' }}
                      >
                        <td className="p-3">
                          <p className="font-medium" style={{ color: '#5A4638' }}>{order.orderNumber}</p>
                          <p className="text-xs" style={{ color: '#8B7355' }}>{order.paymentMethod}</p>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium" style={{ color: '#5A4638' }}>{order.userName}</p>
                            <p className="text-xs" style={{ color: '#8B7355' }}>{order.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p style={{ color: '#5A4638' }}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-3 font-medium" style={{ color: '#A79277' }}>
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="p-3">
                          <span 
                            className="px-2 py-1 text-xs rounded font-medium"
                            style={{ 
                              backgroundColor: getStatusColor(order.status) + '20',
                              color: getStatusColor(order.status)
                            }}
                          >
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="px-2 py-1 text-sm rounded focus:outline-none"
                              style={{ 
                                backgroundColor: '#FFF2E1',
                                border: '1px solid #D1BB9E',
                                color: '#5A4638'
                              }}
                            >
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm" style={{ color: '#8B7355' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </Dashboard>
  );
};

export default OrdersManagement;