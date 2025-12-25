import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import Navbar from '../Component/Navbar';
import { useNavigate } from 'react-router-dom';

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
          <div className="text-xl" style={{ color: '#5A4638' }}>Please login to view profile</div>
        </div>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true }); 
  };

  const profileOptions = [
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'logout', label: 'Logout', icon: LogoutIcon, action: handleLogout },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: '#FFF2E1' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#A79277' }}>
              <span className="text-3xl font-bold" style={{ color: '#FFF2E1' }}>
                {user.fname.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>{user.fname} {user.lname}</h1>
            <p className="text-lg" style={{ color: '#8B7355' }}>{user.email}</p>
            <p className="text-sm mt-1" style={{ color: '#A79277' }}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFF9F0', border: '1px solid #D1BB9E' }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: '#5A4638' }}>Account Settings</h3>
                <div className="space-y-2">
                  {profileOptions.map((option) => {
                    const isLogoutOption = option.id === 'logout';
                    
                    return (
                      <button
                        key={option.id}
                        onClick={isLogoutOption ? option.action : () => setActiveTab(option.id)}
                        className="w-full flex items-center px-4 py-3 rounded-lg transition duration-200 text-left"
                        style={{ 
                          backgroundColor: activeTab === option.id && !isLogoutOption ? '#A79277' : 'transparent',
                          color: activeTab === option.id && !isLogoutOption ? '#FFF2E1' : '#5A4638'
                        }}
                        onMouseOver={(e) => {
                          if (isLogoutOption) {
                            e.target.style.backgroundColor = '#E53E3E';
                            e.target.style.color = '#FFF2E1';
                          } else {
                            e.target.style.backgroundColor = '#F5E6D3';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (isLogoutOption) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#5A4638';
                          } else {
                            e.target.style.backgroundColor = activeTab === option.id ? '#A79277' : 'transparent';
                            e.target.style.color = activeTab === option.id ? '#FFF2E1' : '#5A4638';
                          }
                        }}
                      >
                        <option.icon className="w-5 h-5 mr-3" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-3">
              <div className="rounded-xl p-6" style={{ backgroundColor: '#FFF9F0', border: '1px solid #D1BB9E' }}>
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#5A4638' }}>Personal Information</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>First Name</label>
                          <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FFF2E1', border: '1px solid #D1BB9E', color: '#5A4638' }}>
                            {user.fname}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>Last Name</label>
                          <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FFF2E1', border: '1px solid #D1BB9E', color: '#5A4638' }}>
                            {user.lname}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>Email Address</label>
                        <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FFF2E1', border: '1px solid #D1BB9E', color: '#5A4638' }}>
                          {user.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>Account Created</label>
                        <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FFF2E1', border: '1px solid #D1BB9E', color: '#5A4638' }}>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;