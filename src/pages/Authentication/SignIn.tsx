import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { stagingURL } from '../../utils/index';
import { BG3, NNA, banner1, banner2 } from '../../images/sample/index';
import CustomToast, { showErrorToast, showSuccessToast } from '../../components/Toast/CustomToast';



const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);


    try {
      const response = await axios.post(`${stagingURL}/api/login/`, {
        username,
        password,
      });

      const {
        access,
        refresh,
        email,
        userid,
        wholesale,
        name,
        phone_number,
        is_staff,
      } = response.data;

      // Simpan data pengguna dan wholesale di localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('userid', userid);
      localStorage.setItem('email', email);
      localStorage.setItem('ws_id', wholesale);
      localStorage.setItem('ws_name', name || '');
      localStorage.setItem('ws_phone_number', phone_number || '');
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('is_staff', is_staff);

      if (is_staff === true) {
        showSuccessToast('Login successful. Redirecting to...');
        setTimeout(() => {
          navigate('/verification');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }, 1500)
      } else {
        navigate('/how-to-claim');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setLoading(false);
        showErrorToast(err.response?.data?.detail || 'Invalid username or password.');
        setError(err.response?.data?.detail || 'Invalid username or password.');
      } else {
        console.log(err);
        showErrorToast(String(err));
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <>
      <CustomToast />
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${BG3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex flex-wrap items-center justify-center w-full">

          <div className="hidden w-full xl:block xl:w-1/2 mb-10">
            <div className="py-17.5 px-26 text-center">
              {/* <span className="mt-15 inline-block">{renderSVG()}</span> */}
              <img src={NNA} alt="NNA" className="inline-block" />
            </div>
          </div>

          <div className="w-full xl:w-1/2 p-10">
            <h2 className="text-2xl font-bold mb-5 text-white">Welcome Back!</h2>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">Username</label>
                <input
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label className="block mb-2 text-sm font-medium text-white">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 cursor-pointer"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center">
                  {/* <input type="checkbox" className="mr-2" />
            Remember me */}
                </label>
                {/* <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </Link> */}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center mt-5">
              {/* Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
          Sign Up
          </Link> */}
            </p>
          </div>

        </div>
      </div>
      <div className="sticky bottom-0 w-full">
        {window.innerWidth >= 768 ? (
          <img src={banner1} className="object-cover w-full h-auto md:w-full" />
        ) : (
          <img src={banner2} className="object-cover w-full h-auto md:w-full" />
        )}
      </div>
    </>
  );
};

export default SignIn;
