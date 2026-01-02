import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Survey from './Survey';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Survey />;
};

export default Index;
