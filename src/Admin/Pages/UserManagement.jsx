import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import Dashboard from '../Component/Dashboard';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/user');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlock = async (user) => {

    if (
      window.confirm(
        `Are you sure you want to ${user.blocked ? "unblock" : "block"} ${user.fname} ${user.lname}?`
      )
    ) {

      try {

        await api.put(`/admin/user/${user.id}`, {
          blocked: !user.blocked
        });

        fetchUsers();

      } catch (error) {

        console.error("Error blocking/unblocking user:", error);

      }
    }
  };

  const handleDelete = async (user) => {

    if (
      window.confirm(
        `Are you sure you want to delete ${user.fname} ${user.lname}?`
      )
    ) {

      try {

        await api.delete(`/admin/user/delete/${user.id}`);

        fetchUsers();

      } catch (error) {

        console.error("Error deleting user:", error);

      }
    }
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5A4638' }}>Users Management</h2>
          <p className="text-sm" style={{ color: '#8B7355' }}>Manage all registered users</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none"
            style={{
              backgroundColor: '#FFF2E1',
              border: '1px solid #D1BB9E',
              color: '#5A4638'
            }}
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5"
            style={{ color: '#A79277' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: '#A79277' }}></div>
            <p className="mt-2" style={{ color: '#A79277' }}>Loading users...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#8B7355' }}>
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: user.blocked ? '#FFEBEE' : '#FFF2E1',
                    borderColor: user.blocked ? '#EF5350' : '#D1BB9E'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: user.blocked ? '#EF5350' : '#A79277',
                          color: '#FFF2E1'
                        }}
                      >
                        <span className="font-semibold">
                          {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold" style={{ color: '#5A4638' }}>
                            {user.fname} {user.lname}
                          </h3>
                          {user.role === 'admin' && (
                            <span
                              className="px-2 py-0.5 text-xs rounded"
                              style={{
                                backgroundColor: '#A79277',
                                color: '#FFF2E1'
                              }}
                            >
                              Admin
                            </span>
                          )}
                          {user.blocked && (
                            <span
                              className="px-2 py-0.5 text-xs rounded"
                              style={{
                                backgroundColor: '#EF5350',
                                color: '#FFF2E1'
                              }}
                            >
                              Blocked
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#8B7355' }}>{user.email}</p>
                        <p className="text-xs" style={{ color: '#A79277' }}>
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>


                    <div className="flex gap-2">

                      {user.role !== "admin" && (
                        <>
                          <button
                            onClick={() => handleBlock(user)}
                            className="px-4 py-1 rounded text-sm font-medium transition duration-200"
                            style={{
                              backgroundColor: user.blocked ? '#4CAF50' : '#EF5350',
                              color: '#FFF2E1',
                              border: `1px solid ${user.blocked ? '#45A049' : '#D32F2F'}`
                            }}
                          >
                            {user.blocked ? 'Unblock' : 'Block'}
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            className="px-4 py-1 rounded text-sm font-medium transition duration-200"
                            style={{
                              backgroundColor: '#5A4638',
                              color: '#FFF2E1',
                              border: '1px solid #3E2F25'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-sm" style={{ color: '#8B7355' }}>
          <div>
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A79277' }}></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF5350' }}></div>
              <span>Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default UsersManagement;