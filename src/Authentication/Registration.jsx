import { useFormik } from 'formik';
import { signup } from './signup';
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

  const {
    register,
    loading,
    error,
    clearError
  } = useAuth();

  const navigate = useNavigate();



  useEffect(() => {

    return () => clearError();

  }, [clearError]);



  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched
  } = useFormik({

    initialValues,

    validationSchema: signup,

    onSubmit: async (values, { resetForm }) => {

      console.log('Submitting form');

      const result = await register(values);

      console.log(result);

      if (result && result.success) {

        resetForm();

        navigate('/OTP-verification', {
          state: {
            email: result.email
          }
        });
      }
    }
  });



  return (

    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FFF2E1' }}
    >

      <div
        className="rounded-xl shadow-lg p-8 max-w-md w-full border"
        style={{
          backgroundColor: '#FFF2E1',
          borderColor: '#D1BB9E'
        }}
      >

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#5A4638' }}
          >
            Zyraé
          </h1>

          <h2
            className="text-xl font-semibold"
            style={{ color: '#A79277' }}
          >
            Create Your Account
          </h2>

        </div>



        {/* ERROR */}

        {error && (

          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm"
            style={{
              backgroundColor: '#FFEBEE',
              border: '1px solid #EF5350',
              color: '#C62828'
            }}
          >
            {error}
          </div>

        )}



        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* FIRST + LAST NAME */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label
                htmlFor="fname"
                className="block text-sm font-medium mb-2"
                style={{ color: '#5A4638' }}
              >
                First Name
              </label>

              <input
                type="text"
                name="fname"
                id="fname"
                value={values.fname}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Afrah"
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor:
                    errors.fname && touched.fname
                      ? '#EF5350'
                      : '#D1BB9E'
                }}
              />

              {
                errors.fname &&
                touched.fname &&
                (
                  <small style={{ color: '#EF5350' }}>
                    {errors.fname}
                  </small>
                )
              }

            </div>



            <div>

              <label
                htmlFor="lname"
                className="block text-sm font-medium mb-2"
                style={{ color: '#5A4638' }}
              >
                Last Name
              </label>

              <input
                type="text"
                name="lname"
                id="lname"
                value={values.lname}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Zayan"
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: '#FFF2E1',
                  borderColor:
                    errors.lname && touched.lname
                      ? '#EF5350'
                      : '#D1BB9E'
                }}
              />

              {
                errors.lname &&
                touched.lname &&
                (
                  <small style={{ color: '#EF5350' }}>
                    {errors.lname}
                  </small>
                )
              }

            </div>

          </div>



          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: '#5A4638' }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="afrah@gmail.com"
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                backgroundColor: '#FFF2E1',
                borderColor:
                  errors.email && touched.email
                    ? '#EF5350'
                    : '#D1BB9E'
              }}
            />

            {
              errors.email &&
              touched.email &&
              (
                <small style={{ color: '#EF5350' }}>
                  {errors.email}
                </small>
              )
            }

          </div>



          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: '#5A4638' }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                backgroundColor: '#FFF2E1',
                borderColor:
                  errors.password && touched.password
                    ? '#EF5350'
                    : '#D1BB9E'
              }}
            />

            {
              errors.password &&
              touched.password &&
              (
                <small style={{ color: '#EF5350' }}>
                  {errors.password}
                </small>
              )
            }

          </div>



          {/* CONFIRM PASSWORD */}

          <div>

            <label
              htmlFor="cpassword"
              className="block text-sm font-medium mb-2"
              style={{ color: '#5A4638' }}
            >
              Confirm Password
            </label>

            <input
              type="password"
              name="cpassword"
              id="cpassword"
              value={values.cpassword}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                backgroundColor: '#FFF2E1',
                borderColor:
                  errors.cpassword && touched.cpassword
                    ? '#EF5350'
                    : '#D1BB9E'
              }}
            />

            {
              errors.cpassword &&
              touched.cpassword &&
              (
                <small style={{ color: '#EF5350' }}>
                  {errors.cpassword}
                </small>
              )
            }

          </div>



          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition"
            style={{
              backgroundColor: '#A79277',
              color: '#FFF2E1'
            }}
          >

            {
              loading
                ? 'Creating Account...'
                : 'Create Account'
            }

          </button>



          {/* LOGIN */}

          <div className="text-center">

            <p
              className="text-sm"
              style={{ color: '#A79277' }}
            >

              Already have an account?

              {' '}

              <Link
                to="/login"
                style={{ color: '#5A4638' }}
                className="font-medium hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Registration;