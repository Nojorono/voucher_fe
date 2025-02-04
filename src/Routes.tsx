import { Route, Routes, Navigate } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DashboardRetailer from './pages/Dashboard/DashboardRetailer';
import FormElements from './components/Forms/FormRegister/FormElements';
import Profile from './pages/Profile/Profile';
import DefaultLayout from './layout/DefaultLayout';
import FormLayout from './components/Forms/FormRegister/FormLayout';
import RegisterRetailer from './pages/RegisterRetailer/RegisterRetailer';
import Settings from './pages/Settings';
import Verification from './pages/VerificationRetailer/Verification';
import Redeem from './pages/RedeemVoucher/Redeem';
import UserRegister from './pages/RegisterUser/UserRegister';
import MasterWholesale from './pages/MasterData/MasterWholesale';
import DashboardVoucher from './pages/Dashboard/DashboardVoucher';
import HowToClaim from './pages/RedeemVoucher/HowToClaim';
import MasterUser from './pages/MasterData/MasterUser';

const isAuthenticated = () => !!localStorage.getItem('token');

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route
            path="/auth/signin"
            element={
                isAuthenticated() ? (
                    <Navigate to="dashboard" replace />
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
                                path="profile"
                                element={
                                    <>
                                        <PageTitle title="Profile" />
                                        <Profile />
                                    </>
                                }
                            />

                            <Route
                                index
                                path="dashboard/dashboard_retailer"
                                element={
                                    <>
                                        <PageTitle title="Dashboard Retailer" />
                                        <DashboardRetailer />
                                    </>
                                }
                            />

                            <Route
                                index
                                path="dashboard/dashboard_voucher"
                                element={
                                    <>
                                        <PageTitle title="Dashboard Voucher" />
                                        <DashboardVoucher />
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

                            <Route
                                path="redeem"
                                element={
                                    <>
                                        <PageTitle title="Redeem" />
                                        <Redeem />
                                    </>
                                }
                            />

                            <Route
                                path="how-to-claim"
                                element={
                                    <>
                                        <PageTitle title="Claim Voucher" />
                                        <HowToClaim />
                                    </>
                                }
                            />

                            <Route
                                path="master_data/user_register"
                                element={
                                    <>
                                        <PageTitle title="Master Register" />
                                        <MasterUser />
                                    </>
                                }
                            />


                            <Route
                                path="/user_register"
                                element={
                                    <>
                                        <PageTitle title="User Register" />
                                        <UserRegister />
                                    </>
                                }
                            />

                            <Route
                                path="master_data/master_wholesale"
                                element={
                                    <>
                                        <PageTitle title="Master Wholesale" />
                                        <MasterWholesale />
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