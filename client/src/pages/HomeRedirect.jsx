import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function HomeRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until loading is false
    if (!loading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h2 className="text-2xl">Loading...</h2>
    </div>
  );
}

export default HomeRedirect;