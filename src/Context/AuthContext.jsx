import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state once on mount
  useEffect(() => {
    const initAuthState = () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        // Clear any logout flag
        localStorage.removeItem('auth-logout');
        
        if (storedUser) {
          console.log('Loading user from localStorage');
          setUser(JSON.parse(storedUser));
        } else {
          console.log('No auth state found in localStorage');
          setUser(null);
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth-logout');
      } finally {
        setIsInitializing(false);
      }
    };

    initAuthState();
  }, []);

  // Broadcast auth state changes
  const broadcastAuthState = useCallback((newUser) => {
    console.log('Broadcasting auth state change');
    
    if (newUser) {
      // Store user
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.removeItem('auth-logout');
    } else {
      // Clear auth state
      localStorage.removeItem('user');
      localStorage.setItem('auth-logout', 'true');
      
      // Clear cart and wishlist
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('auth-state-change', { 
      detail: { user: newUser }
    }));
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'auth-logout') {
        if (event.newValue === 'true') {
          console.log('Logout detected from another tab');
          setUser(null);
          localStorage.removeItem('cart');
          localStorage.removeItem('wishlist');
        }
      } else if (event.key === 'user') {
        if (!event.newValue) {
          console.log('User removed from another tab');
          setUser(null);
        } else if (event.newValue && event.oldValue !== event.newValue) {
          // User changed in another tab
          try {
            setUser(JSON.parse(event.newValue));
          } catch (err) {
            console.error('Failed to parse user from storage:', err);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom auth events
    const handleAuthStateChange = (event) => {
      if (event.detail && event.detail.user !== user) {
        console.log('Auth state change event received');
        setUser(event.detail.user);
      }
    };

    window.addEventListener('auth-state-change', handleAuthStateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-change', handleAuthStateChange);
    };
  }, [user]);

  // Broadcast auth state only when user actually changes
  useEffect(() => {
    if (!isInitializing) {
      const currentStoredUser = localStorage.getItem('user');
      const currentUserJson = user ? JSON.stringify(user) : null;
      
      // Only broadcast if there's an actual change
      if (currentUserJson !== currentStoredUser) {
        broadcastAuthState(user);
      }
    }
  }, [user, broadcastAuthState, isInitializing]);

  const clearError = () => setError('');

  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting registration process...', userData);

      const checkResponse = await api.get('/users');
      console.log('All users:', checkResponse.data);

      const existingUser = checkResponse.data.find(user => user.email === userData.email);

      if (existingUser) {
        setError('User with this email already exists');
        return false;
      }

      const { cpassword, ...userWithoutCpassword } = userData;

      const newUser = {
        id: Date.now().toString(),
        ...userWithoutCpassword,
        role: 'user', // Default role for new registrations
        createdAt: new Date().toISOString()
      };

      console.log('Creating new user:', newUser);

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

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      console.log('Attempting login for:', email);

      const response = await api.get('/users');
      console.log('Users from DB:', response.data);

      const foundUser = response.data.find(user =>
        user.email === email && user.password === password
      );

      if (foundUser) {
        console.log('User found:', foundUser);
        setUser(foundUser);
        return foundUser; // Return user object with role
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

  const logout = () => {
    console.log('Logging out user');
    
    setUser(null);
    setError('');
    
    // Clear auth state
    broadcastAuthState(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    setError,
    clearError,
    isInitializing
  };

  return (
    <AuthContext.Provider value={value}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};