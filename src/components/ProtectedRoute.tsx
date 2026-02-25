import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
