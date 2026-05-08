import { createContext, useContext, useState,useEffect } from 'react';
import { api } from '../API/Axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [role,setRole]=useState(null)

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
       const fetchUser=async()=>{
        try{
            const res=await api.get("/auth/getUser");
            setUser(res.data.UserData);
            setRole(res.data.UserData.role)
        }catch(e){

              setUser(null);
          setRole(null);
        }finally{
            setLoading(false)
        }
       };
      
       fetchUser();
      
    }, [])

  const clearError = () => {
    setError('');
  };



  // ================= REGISTER =================

  const register = async (userData) => {

    setLoading(true);
    setError('');

    try {

      const { cpassword, ...dataToSend } = userData;

      const response = await api.post(
        '/auth/register',
        dataToSend
      );

      return {
        success: true,
        email: dataToSend.email,
        message: response.data.message
      };

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        'Registration failed'
      );

      return false;

    } finally {

      setLoading(false);

    }
  };



  // ================= LOGIN =================

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      // SAVE USER DATA
      setUser({
        fname: response.data.fname,
        lname: response.data.lname,
        email: response.data.email,
        role: response.data.role,
      });

      return {
        success: true,
        data: response.data
      };




    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

      return false;

    } finally {
      setLoading(false);
    }
  };



  // ================= LOGOUT =================

  const logout = async () => {

    try {

      await api.post('/auth/logout');

      setUser(null);

    } catch (err) {

      console.log(err);

    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ADD THIS
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};