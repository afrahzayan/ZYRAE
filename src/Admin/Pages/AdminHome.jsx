import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import Dashboard from '../Component/Dashboard';
import { Link } from 'react-router-dom';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [weeklyOrdersData, setWeeklyOrdersData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const dashboardRes = await api.get('/admin/dashboard');

      const data = dashboardRes.data;

      setStats({
        totalUsers: data.totalUsers,
        totalProducts: data.totalProducts,
        totalOrders: data.totalOrders,
        totalRevenue: data.totalRevenue,
        recentOrders: data.recentOrders,
        recentUsers: data.recentUsers
      });

      setRevenueChartData(data.revenueChartData);
      setOrderStatusData(data.orderStatusData);
      setWeeklyOrdersData(data.weeklyOrdersData);

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

    const monthlyData = Array(6)
      .fill(0)
      .map((_, index) => {

        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - index,
          1
        );

        return {
          month: months[date.getMonth()],
          year: date.getFullYear(),
          revenue: 0
        };

      }).reverse();

    orders.forEach((order) => {

      const orderDate = new Date(order.orderDate || order.createdAt);

      const orderMonth = orderDate.getMonth();

      const orderYear = orderDate.getFullYear();

      const monthIndex = monthlyData.findIndex(
        (m) =>
          m.month === months[orderMonth] &&
          m.year === orderYear
      );

      if (monthIndex !== -1) {
        monthlyData[monthIndex].revenue += order.totalAmount || 0;
      }
    });

    return monthlyData;
  };

  const calculateOrderStatusData = (orders) => {

    const counts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach((order) => {

      const status = order.status?.toLowerCase();

      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return [
      { name: 'Processing', value: counts.processing },
      { name: 'Shipped', value: counts.shipped },
      { name: 'Delivered', value: counts.delivered },
      { name: 'Cancelled', value: counts.cancelled }
    ];
  };

  const calculateWeeklyOrders = (orders) => {

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeklyData = days.map((day) => ({
      day,
      orders: 0
    }));

    orders.forEach((order) => {

      const date = new Date(order.orderDate || order.createdAt);

      const dayIndex = date.getDay();

      weeklyData[dayIndex].orders += 1;
    });

    return weeklyData;
  };

  const getStatusColor = (status) => {

    switch (status?.toLowerCase()) {

      case 'processing':
        return '#F59E0B';

      case 'shipped':
        return '#3B82F6';

      case 'delivered':
        return '#10B981';

      case 'cancelled':
        return '#f8716a';

      default:
        return '#8B7355';
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

  if (loading) {
    return (
      <Dashboard>
        <div className="text-center py-20">
          Loading Dashboard...
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>

      <div className="space-y-6">

        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: '#5A4638' }}
          >
            Admin Dashboard
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: '#8B7355' }}
          >
            Welcome back!
          </p>
        </div>




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

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* REVENUE CHART */}

          <div
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: '#FFF2E1',
              borderColor: '#D1BB9E'
            }}
          >

            <h3
              className="text-lg font-bold mb-6"
              style={{ color: '#5A4638' }}
            >
              Monthly Revenue
            </h3>

            <div style={{ width: '100%', height: 300 }}>

              <ResponsiveContainer>

                <LineChart data={revenueChartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#A79277"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}

          <div
  className="p-6 rounded-xl border"
  style={{
    backgroundColor: '#FFF2E1',
    borderColor: '#D1BB9E'
  }}
>

  <h3
    className="text-lg font-bold mb-6"
    style={{ color: '#5A4638' }}
  >
    Order Status
  </h3>

  <div style={{ width: '100%', height: 300 }}>

    <ResponsiveContainer>

      <PieChart>

        <Pie
          data={orderStatusData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent
          }) => {

            const RADIAN = Math.PI / 180;

            const radius =
              innerRadius +
              (outerRadius - innerRadius) * 0.5;

            const x =
              cx + radius * Math.cos(-midAngle * RADIAN);

            const y =
              cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight="bold"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >

          <Cell fill="#f8c773" />
          <Cell fill="#85b0f6" />
          <Cell fill="#04af76" />
          <Cell fill="#ef817b" />

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>
        </div>

        {/* WEEKLY ORDERS */}

        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: '#FFF2E1',
            borderColor: '#D1BB9E'
          }}
        >

          <h3
            className="text-lg font-bold mb-6"
            style={{ color: '#5A4638' }}
          >
            Weekly Orders
          </h3>

          <div style={{ width: '100%', height: 300 }}>

            <ResponsiveContainer>

              <BarChart data={weeklyOrdersData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#A79277"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </Dashboard>
  );
};

export default AdminHome;