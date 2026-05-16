import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { api } from '../api/axios';

const OTPVerification = () => {

  const { setUser } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const inputRefs = useRef([]);



  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (error) setError('');
    if (success) setSuccess('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down events
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (pastedData && /^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 4).split('');
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 4; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Validate OTP
  const validateOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return false;
    }
    if (!/^\d{4}$/.test(otpString)) {
      setError('OTP must contain only digits');
      return false;
    }
    return true;
  };

  // Handle verify OTP
  const handleVerify = async () => {
    if (!validateOTP()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        otp: otp.join('')
      });

      setSuccess(response.data.message);

      // SAVE USER GLOBALLY
      setUser({
        fname: response.data.fname,
        lname: response.data.lname,
        email: response.data.email,
        role: response.data.role,
      });

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Verification failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/resend-otp', {
        email
      });

      setSuccess(response.data.message);

      setCanResend(false);
      setCountdown(30);

      setOtp(['', '', '', '']);

      inputRefs.current[0]?.focus();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to resend OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FFF2E1' }}>
      <div
        className="rounded-xl shadow-lg p-8 max-w-md w-full border"
        style={{ backgroundColor: '#FFF2E1', borderColor: '#D1BB9E' }}
      >
        {/* Brand Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5A4638' }}>Zyraé</h1>
          <h2 className="text-xl font-semibold" style={{ color: '#A79277' }}>Verify Your OTP</h2>
          <p className="text-sm mt-2" style={{ color: '#8B7355' }}>
            Enter the 4-digit OTP sent to your email address.
          </p>
        </div>

        {/* Error Message */}
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

        {/* Success Message */}
        {success && (
          <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ backgroundColor: '#E8F5E9', border: '1px solid #66BB6A', color: '#2E7D32' }}>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* OTP Input Boxes */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3" style={{ color: '#5A4638' }}>
            Enter OTP *
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-xl font-semibold rounded-lg focus:outline-none transition-all duration-200 border"
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor: error ? '#EF5350' : '#D1BB9E',
                  color: '#5A4638'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#A79277';
                  e.target.style.boxShadow = '0 0 0 3px rgba(167, 146, 119, 0.1)';
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#D1BB9E';
                  }
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>
          {error && (
            <div className="flex items-center mt-2 justify-center">
              <svg className="w-4 h-4 mr-1" style={{ color: '#EF5350' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <small style={{ color: '#EF5350' }} className="text-xs">OTP must be exactly 4 digits</small>
            </div>
          )}
        </div>

        {/* Verify OTP Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-4"
          style={{
            backgroundColor: '#A79277',
            color: '#FFF2E1',
            border: '1px solid #8B7355'
          }}
          onMouseOver={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#8B7355';
          }}
          onMouseOut={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#A79277';
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 mr-2" style={{ borderColor: '#FFF2E1' }}></div>
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>

        {/* Resend OTP Section */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-sm font-medium hover:underline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#A79277' }}
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm" style={{ color: '#8B7355' }}>
              Resend OTP in <span style={{ color: '#5A4638', fontWeight: 600 }}>{countdown}s</span>
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid #D1BB9E' }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2" style={{ backgroundColor: '#FFF2E1', color: '#A79277' }}>
              Need help?
            </span>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-sm" style={{ color: '#A79277' }}>
            Didn't receive the code?{' '}
            <a
              href="#"
              className="font-medium hover:underline transition duration-200"
              style={{ color: '#5A4638' }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Contact support');
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        input::placeholder {
          color: #A79277;
          opacity: 0.6;
        }
        
        input:focus {
          outline: none;
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;