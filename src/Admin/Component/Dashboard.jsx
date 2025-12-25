import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Admin menu items for perfume e-commerce
  const menuItems = [
    {
      path: '/admin/home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'home'
    },
    {
      path: '/admin/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: 'Products'
    },
    {
      path: '/admin/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      label: 'Orders'
    },
    {
      path: '/admin/user',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      label: 'user'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFF2E1' }}>
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col transition-all duration-300 shadow-lg`}
        style={{ backgroundColor: '#A79277', borderRight: '1px solid #8B7355' }}
      >
        
        {/* Sidebar Header */}
        <div className="p-4 flex items-center h-16">
          {sidebarOpen && (
            <h2 className="text-xl font-bold flex-1" style={{ color: '#FFF2E1' }}>Zyraé Admin</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#FFF2E1', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3 p-3' : 'justify-center p-3'} rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-[#5A4638]'
                  : 'text-[#FFF2E1] hover:bg-white hover:bg-opacity-20'
              }`}
              title={sidebarOpen ? '' : item.label}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout - Only show when sidebar is open */}
        {sidebarOpen && (
          <div className="p-4" style={{ borderTop: '1px solid #8B7355' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FFF2E1', color: '#A79277' }}
              >
                <span className="font-semibold text-sm">
                  {user?.fname?.charAt(0)}{user?.lname?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#FFF2E1' }}>
                  {user?.fname} {user?.lname}
                </p>
                <p className="text-xs truncate" style={{ color: '#EAD8C0' }}>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF2E1',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Minimal logout when sidebar collapsed */}
        {!sidebarOpen && (
          <div className="p-4" style={{ borderTop: '1px solid #8B7355' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg transition-colors"
              style={{ 
                color: '#FFF2E1',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header 
          className="shadow-sm"
          style={{ 
            backgroundColor: '#FFF2E1',
            borderBottom: '1px solid #D1BB9E'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 sm:gap-0">
            <h1 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#5A4638' }}
            >
              Admin Dashboard
            </h1>
            <div className="flex items-center">
              <span className="text-sm" style={{ color: '#8B7355' }}>
                Welcome,{' '}
                <span className="hidden sm:inline font-medium" style={{ color: '#5A4638' }}>
                  {user?.fname} {user?.lname}
                </span>
                <span className="sm:hidden font-medium" style={{ color: '#5A4638' }}>
                  {user?.fname?.charAt(0)}.{user?.lname?.charAt(0)}.
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main 
          className="flex-1 overflow-auto p-4 sm:p-6"
          style={{ backgroundColor: '#FFF9F0' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;



