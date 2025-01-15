import React, { useState, ReactNode, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import SignIn from '../pages/Authentication/SignIn';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children} {/* This is where your nested routes will render */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
