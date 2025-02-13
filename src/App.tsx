import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import AppRoutes from './Routes';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const validateToken = async () => {
      setLoading(false);
    };
    validateToken();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Redirect to profile if already authenticated and trying to access sign-in
  if (token && pathname === '/auth/signin') {
    return <Navigate to="/profile" replace />;
  }

  // Tambahkan logika untuk tidak mengalihkan jika berada di halaman lain
  if (token && pathname !== '/auth/signin') {
    return <AppRoutes />; // Pastikan tetap di halaman yang sama
  }

  return <AppRoutes />;
}

export default App;