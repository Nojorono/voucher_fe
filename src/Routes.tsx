import { Route, Routes, Navigate } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import FormLayout from './pages/Form/FormLayout';
import RegisterRetailer from './pages/RegisterRetailer';
import Settings from './pages/Settings';
import Verification from './pages/Verification';

const isAuthenticated = () => !!localStorage.getItem('token');

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route
            path="/auth/signin"
            element={
                isAuthenticated() ? (
                    <Navigate to="/profile" replace />
                ) : (
                    <>
                        <PageTitle title="Sign In" />
                        <SignIn />
                    </>
                )
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
        <Route
            path="/register/retailer"
            element={
                <>
                    <PageTitle title="Register Retailer" />
                    <RegisterRetailer />
                </>
            }
        />

        {/* Protected Routes */}
        <Route
            path="*"
            element={
                isAuthenticated() ? (
                    <DefaultLayout>
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
                            <Route
                                path="forms/form-layout"
                                element={
                                    <>
                                        <PageTitle title="Form Layout" />
                                        <FormLayout />
                                    </>
                                }
                            />
                            <Route
                                path="settings"
                                element={
                                    <>
                                        <PageTitle title="Settings" />
                                        <Settings />
                                    </>
                                }
                            />
                            <Route
                                path="verification"
                                element={
                                    <>
                                        <PageTitle title="Verification" />
                                        <Verification />
                                    </>
                                }
                            />
                            {/* Redirect to dashboard if path is not found */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </DefaultLayout>
                ) : (
                    <Navigate to="/auth/signin" replace />
                )
            }
        />
    </Routes>
);

export default AppRoutes;