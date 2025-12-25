import { useFormik } from 'formik';
import { signup } from './Signup';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

const initialValues = {
  fname: '',
  lname: '',
  email: '',
  password: '',
  cpassword: '',  
};

function Registration() {
  const { register, loading, error,clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: initialValues,
    validationSchema: signup,
    onSubmit: async (values, { resetForm }) => {
      console.log('Form submitted with values:', values);
      
      const success = await register(values);
      console.log('Registration success:', success);
      
      if (success) {
        resetForm();
        navigate('/login', { 
          state: { message: 'Registration successful! Please login to continue.' }
        });
      }
    }
  });

  console.log('Form errors:', errors);
  console.log('Touched fields:', touched);
  console.log('Form values:', values);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFF2E1' }}>
      <div className="rounded-xl shadow-lg p-8 max-w-md w-full border" style={{ backgroundColor: '#FFF2E1', borderColor: '#D1BB9E' }}>
      
           <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>Zyraé</h1>
          <h2 className="text-xl font-semibold" style={{ color: '#A79277' }}>Create Your Account</h2>
          <p className="text-sm mt-2" style={{ color: '#8B7355' }}>
            Join our community and start your journey
          </p>
        </div>
        
  
        {error && (
          <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ backgroundColor: '#FFEBEE', border: '1px solid #EF5350', color: '#C62828' }}>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

      
        <form onSubmit={handleSubmit} className="space-y-6">
    
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='fname' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
                First Name *
              </label>
              <input
                type='text'
                name='fname'
                id='fname'
                value={values.fname}
                onBlur={handleBlur}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                  errors.fname && touched.fname ? 'border-2' : 'border'
                }`}
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor: errors.fname && touched.fname ? '#EF5350' : '#D1BB9E',
                  color: '#5A4638'
                }}
                placeholder="Afrah"
              />
              {errors.fname && touched.fname && (
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <small style={{ color: '#EF5350' }} className="text-xs">{errors.fname}</small>
                </div>
              )}
            </div>

            <div>
              <label htmlFor='lname' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
                Last Name *
              </label>
              <input
                type='text'
                name='lname'
                id='lname'
                value={values.lname}
                onBlur={handleBlur}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                  errors.lname && touched.lname ? 'border-2' : 'border'
                }`}
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor: errors.lname && touched.lname ? '#EF5350' : '#D1BB9E',
                  color: '#5A4638'
                }}
                placeholder="Zayan"
              />
              {errors.lname && touched.lname && (
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <small style={{ color: '#EF5350' }} className="text-xs">{errors.lname}</small>
                </div>
              )}
            </div>
          </div>

          

          <div>
            <label htmlFor='email' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
              Email Address *
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                errors.email && touched.email ? 'border-2' : 'border'
              }`}
              style={{
                backgroundColor: '#FFF2E1',
                borderColor: errors.email && touched.email ? '#EF5350' : '#D1BB9E',
                color: '#5A4638'
              }}
              placeholder="afrah.zayan@gmail.com"
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
              Password *
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                errors.password && touched.password ? 'border-2' : 'border'
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
            <p className="text-xs mt-1" style={{ color: '#8B7355' }}>
              Password must be at least 6 characters long
            </p>
          </div>




          
          <div>
            <label htmlFor='cpassword' className="block text-sm font-medium mb-2" style={{ color: '#5A4638' }}>
              Confirm Password *
            </label>
            <input
              type='password'
              name='cpassword'
              id='cpassword'
              value={values.cpassword}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg focus:outline-none transition duration-200 ${
                errors.cpassword && touched.cpassword ? 'border-2' : 'border'
              }`}
              style={{
                backgroundColor: '#FFF2E1',
                borderColor: errors.cpassword && touched.cpassword ? '#EF5350' : '#D1BB9E',
                color: '#5A4638'
              }}
              placeholder="••••••••"
            />
            {errors.cpassword && touched.cpassword && (
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <small style={{ color: '#EF5350' }} className="text-xs">{errors.cpassword}</small>
              </div>
            )}
          </div>

          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mt-1 mr-3 rounded focus:ring-0"
              style={{ 
                backgroundColor: '#FFF2E1',
                borderColor: '#D1BB9E',
                color: '#A79277'
              }}
            />
            <label htmlFor="terms" className="text-sm" style={{ color: '#5A4638' }}>
              I agree to the{' '}
              <a href="#" className="hover:underline" style={{ color: '#A79277' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="hover:underline" style={{ color: '#A79277' }}>Privacy Policy</a>
            </label>
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid #D1BB9E' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ backgroundColor: '#FFF2E1', color: '#A79277' }}>
                Already a member?
              </span>
            </div>
          </div>

          
          <div className="text-center">
            <p className="text-sm" style={{ color: '#A79277' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium hover:underline transition duration-200"
                style={{ color: '#5A4638' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>

      
      <style jsx global>{`
        input::placeholder {
          color: #A79277;
          opacity: 0.6;
        }
        
        input:focus {
          box-shadow: 0 0 0 3px rgba(167, 146, 119, 0.1);
        }
        
        /* Custom checkbox styling */
        input[type="checkbox"] {
          accent-color: #A79277;
        }
      `}</style>
    </div>
  );
}

export default Registration;