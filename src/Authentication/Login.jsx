import { useFormik } from 'formik';
import { LoginValidation } from './LoginValidation';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const initialValues = {
  email: '',
  password: ''
};

function Login() {
  const { login, loading, error, clearError, isInitializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginValidation,
    onSubmit: async (values, { resetForm }) => {
      console.log('Login form submitted:', values);
      const user = await login(values.email, values.password);
      if (user) {
        resetForm();
        
        // Check if user is blocked
        if (user.isBlocked) {
          alert('Your account has been blocked. Please contact administrator.');
          return;
        }
        
        // Check user role and redirect accordingly
        if (user.role === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/');
        }
      }
    }
  });

  // Show loading while auth is initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF2E1' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: '#A79277' }}></div>
          <p style={{ color: '#5A4638' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFF2E1' }}>
      <div className="rounded-xl shadow-lg p-8 max-w-md w-full border" style={{ backgroundColor: '#FFF2E1', borderColor: '#D1BB9E' }}>
  
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>Zyraé</h1>
          <h2 className="text-xl font-semibold" style={{ color: '#A79277' }}>Welcome Back</h2>
        </div>
        
        {location.state?.message && (
          <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{ backgroundColor: '#E8F5E9', border: '1px solid #4CAF50', color: '#2E7D32' }}>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {location.state.message}
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{ backgroundColor: '#FFEBEE', border: '1px solid #EF5350', color: '#C62828' }}>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor='email' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                errors.email && touched.email 
                  ? 'border-2' 
                  : 'border'
              }`}
              style={{
                backgroundColor: '#FFF2E1',
                borderColor: errors.email && touched.email ? '#EF5350' : '#D1BB9E',
                color: '#5A4638'
              }}
              placeholder="you@gmail.com"
            />
            {errors.email && touched.email && (
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <small style={{ color: '#EF5350' }} className="text-xs">{errors.email}</small>
              </div>
            )}
          </div>

          <div>
            <label htmlFor='password' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                errors.password && touched.password 
                  ? 'border-2' 
                  : 'border'
              }`}
              style={{
                backgroundColor: '#FFF2E1',
                borderColor: errors.password && touched.password ? '#EF5350' : '#D1BB9E',
                color: '#5A4638'
              }}
              placeholder="••••••••"
            />
            {errors.password && touched.password && (
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <small style={{ color: '#EF5350' }} className="text-xs">{errors.password}</small>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm hover:underline transition duration-200"
              style={{ color: '#A79277' }}
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            style={{ 
              backgroundColor: '#A79277',
              color: '#FFF2E1',
              border: '1px solid #8B7355'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#8B7355';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#A79277';
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 mr-2" style={{ borderColor: '#FFF2E1' }}></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        
          <p className="text-center text-sm mt-6" style={{ color: '#A79277' }}>
            Don't have an account?{' '}
            <Link 
              to="/registration" 
              className="font-medium hover:underline transition duration-200"
              style={{ color: '#5A4638' }}
            >
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;