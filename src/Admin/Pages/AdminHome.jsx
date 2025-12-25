import React, { useState, useEffect } from 'react';
import { api } from '../../API/Axios';
import Dashboard from '../Component/Dashboard';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [revenueChartData, setRevenueChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/orders')
      ]);

      const users = usersRes.data;
      const products = productsRes.data;
      const orders = ordersRes.data;

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => 
        sum + (order.totalAmount || 0), 0
      );

      // Get recent orders (last 5)
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
        .slice(0, 5);

      // Get recent users (last 5)
      const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Prepare revenue chart data (last 6 months)
      const monthlyRevenue = calculateMonthlyRevenue(orders);

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        recentOrders,
        recentUsers
      });

      setRevenueChartData(monthlyRevenue);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyRevenue = (orders) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentDate = new Date();
    const monthlyData = Array(6).fill(0).map((_, index) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
      return {
        month: months[date.getMonth()],
        year: date.getFullYear(),
        revenue: 0
      };
    }).reverse();

    orders.forEach(order => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      
      const monthIndex = monthlyData.findIndex(m => 
        m.month === months[orderMonth] && m.year === orderYear
      );
      
      if (monthIndex !== -1) {
        monthlyData[monthIndex].revenue += (order.totalAmount || 0);
      }
    });

    return monthlyData;
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'processing': return '#F59E0B';
      case 'shipped': return '#3B82F6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#8B7355';
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link 
      to={link} 
      className="block p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1"
      style={{ 
        backgroundColor: '#FFF2E1',
        borderColor: '#D1BB9E'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#8B7355' }}>{title}</p>
          <h3 className="text-2xl font-bold mt-2" style={{ color: '#5A4638' }}>{value}</h3>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + '20', color: color }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span style={{ color: '#A79277' }}>View Details</span>
        <svg 
          className="ml-2 w-4 h-4"
          style={{ color: '#A79277' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#5A4638' }}>Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#8B7355' }}>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
            color="#A79277"
            link="/admin/users"
          />
          
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            }
            color="#8B7355"
            link="/admin/products"
          />
          
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            }
            color="#5A4638"
            link="/admin/orders"
          />
          
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h6V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
                <path d="M11 3h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V4a1 1 0 011-1zm8 8h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1z" />
              </svg>
            }
            color="#10B981"
            link="/admin/orders"
          />
        </div>

        {/* Recent Orders - Full Width */}
        <div 
          className="p-6 rounded-xl border"
          style={{ 
            backgroundColor: '#FFF2E1',
            borderColor: '#D1BB9E'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#5A4638' }}>Recent Orders</h3>
            <Link 
              to="/admin/orders" 
              className="text-sm hover:underline"
              style={{ color: '#A79277' }}
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-center py-4" style={{ color: '#8B7355' }}>No recent orders</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="p-3 rounded-lg border flex items-center justify-between"
                  style={{ 
                    backgroundColor: '#FFFCF5',
                    borderColor: '#EAD8C0'
                  }}
                >
                  <div>
                    <p className="font-medium" style={{ color: '#5A4638' }}>
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs" style={{ color: '#8B7355' }}>
                      {order.userName} • {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold" style={{ color: '#A79277' }}>
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded mt-1"
                      style={{ 
                        backgroundColor: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}
                    >
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users - Full Width */}
        <div 
          className="p-6 rounded-xl border"
          style={{ 
            backgroundColor: '#FFF2E1',
            borderColor: '#D1BB9E'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#5A4638' }}>Recent Users</h3>
            <Link 
              to="/admin/users" 
              className="text-sm hover:underline"
              style={{ color: '#A79277' }}
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-center py-4" style={{ color: '#8B7355' }}>No recent users</p>
            ) : (
              stats.recentUsers.map((user) => (
                <div 
                  key={user.id}
                  className="p-3 rounded-lg border flex items-center"
                  style={{ 
                    backgroundColor: '#FFFCF5',
                    borderColor: '#EAD8C0'
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: '#A79277', color: '#FFF2E1' }}
                  >
                    <span className="font-semibold">
                      {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#5A4638' }}>
                      {user.fname} {user.lname}
                    </p>
                    <p className="text-xs" style={{ color: '#8B7355' }}>
                      {user.email}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#A79277' }}>
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AdminHome;