import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../API/Axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Clear error messages
  const clearError = () => setError('');

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting registration process...', userData);
      
      // Check if user already exists
      const checkResponse = await api.get('/users');
      console.log('All users:', checkResponse.data);
      
      const existingUser = checkResponse.data.find(user => user.email === userData.email);
      
      if (existingUser) {
        setError('User with this email already exists');
        return false;
      }

      // Create new user - remove cpassword as we don't want to store it
      const { cpassword, ...userWithoutCpassword } = userData;
      
      const newUser = {
        id: Date.now().toString(),
        ...userWithoutCpassword,
        createdAt: new Date().toISOString()
      };

      console.log('Creating new user:', newUser);

      // Save user to database
      const createResponse = await api.post('/users', newUser);
      console.log('Create response:', createResponse);
      
      if (createResponse.data) {
        console.log('User created successfully');
        return true;
      } else {
        setError('Failed to create user account');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again. ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      console.log('Attempting login for:', email);
      
      const response = await api.get('/users');
      console.log('Users from DB:', response.data);
      
      // Find user by email and password
      const foundUser = response.data.find(user => 
        user.email === email && user.password === password
      );

      if (foundUser) {
        console.log('User found:', foundUser);
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again. ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setError('');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    setError,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};