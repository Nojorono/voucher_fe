import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && token.length > 0; // Verifikasi token yang benar ada
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/auth/signin" replace />;
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Simulate token validation process
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Example: Add logic to verify token validity with backend
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Sign In" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Sign Up" />
            <SignUp />
          </>
        }
      />

      {/* Protected Routes */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <DefaultLayout>
              {/* Pass the nested routes as children here */}
              <Routes>
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="eCommerce Dashboard" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <>
                      <PageTitle title="Profile" />
                      <Profile />
                    </>
                  }
                />
                <Route
                  path="forms/form-elements"
                  element={
                    <>
                      <PageTitle title="Form Elements" />
                      <FormElements />
                    </>
                  }
                />
                {/* Redirect if route not found */}
                <Route path="*" element={<Navigate to="/auth/signin" replace />} />
              </Routes>
            </DefaultLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
