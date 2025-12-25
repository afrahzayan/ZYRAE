
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isInitializing } = useAuth();
  
  
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
  
  
  if (!user) {
    
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    
    return <Navigate to="/" replace />;
  }
  
  
  return children;
};

export default AdminRoute;