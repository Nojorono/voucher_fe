import { Route, Routes, Navigate } from 'react-router-dom';

import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DashboardRetailer from './pages/Dashboard/DashboardRetailer';
import DefaultLayout from './layout/DefaultLayout';
import RegisterRetailer from './pages/RegisterRetailer/RegisterRetailer';
import Verification from './pages/VerificationRetailer/Verification';
import Redeem from './pages/RedeemVoucher/Redeem';
import UserRegister from './pages/RegisterUser/UserRegister';
import MasterWholesale from './pages/MasterData/MasterWholesale';
import DashboardVoucher from './pages/Dashboard/DashboardVoucher';
import HowToClaim from './pages/RedeemVoucher/HowToClaim';
import MasterUser from './pages/MasterData/MasterUser';
import Reimbursement from './pages/Reimburse/Reimbursement';
import VerificationReimburse from './pages/VerificationReimburse/VerificationReimburse';
import Profile from './pages/Profile/Profile';


const AppRoutes = () => {

    const isAuthenticated = () => !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_staff') === 'true';

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
            // element={
            //     isAuthenticated() ? (
            //         <Navigate to="dashboard" replace />
            //     ) : (
            //         <>
            //             <PageTitle title="Sign In" />
            //             <SignIn />
            //         </>
            //     )
            // }
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
                    // isAuthenticated() ? (
                    //     <DefaultLayout>
                    //         <Routes>
                    //             {isAdmin ? (
                    //                 <>
                    //                     <Route
                    //                         path="verification"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Verification" />
                    //                                 <Verification />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         path="master_data/user_register"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Master Register" />
                    //                                 <MasterUser />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         path="/user_register"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="User Register" />
                    //                                 <UserRegister />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         path="master_data/master_wholesale"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Master Agen" />
                    //                                 <MasterWholesale />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         path="reimburse_checking"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Reimburse Verification" />
                    //                                 <VerificationReimburse />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         index
                    //                         path="dashboard/dashboard_retailer"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Dashboard Retailer" />
                    //                                 <DashboardRetailer />
                    //                             </>
                    //                         }
                    //                     />

                    //                     <Route
                    //                         index
                    //                         path="dashboard/dashboard_voucher"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Dashboard Voucher" />
                    //                                 <DashboardVoucher />
                    //                             </>
                    //                         }
                    //                     />
                    //                 </>) : (
                    //                 // NON ADMIN ROUTES
                    //                 <>
                    //                     <Route
                    //                         path="*"
                    //                         element={
                    //                             <>
                    //                                 <PageTitle title="Page Not Found" />
                    //                                 <div>Halaman tidak tersedia</div>
                    //                             </>
                    //                         }
                    //                     />
                    //                 </>
                    //             )}

                    //             <Route
                    //                 path="profile"
                    //                 element={
                    //                     <>
                    //                         <PageTitle title="Profile" />
                    //                         <Profile />
                    //                     </>
                    //                 }
                    //             />

                    //             <Route
                    //                 path="redeem"
                    //                 element={
                    //                     <>
                    //                         <PageTitle title="Redeem" />
                    //                         <Redeem />
                    //                     </>
                    //                 }
                    //             />

                    //             <Route
                    //                 path="how-to-claim"
                    //                 element={
                    //                     <>
                    //                         <PageTitle title="Claim Voucher" />
                    //                         <HowToClaim />
                    //                     </>
                    //                 }
                    //             />

                    //             <Route
                    //                 path="/reimbursement"
                    //                 element={
                    //                     <>
                    //                         <PageTitle title="Reimbursement" />
                    //                         <Reimbursement />
                    //                     </>
                    //                 }
                    //             />

                    //             {/* Redirect to dashboard if path is not found */}
                    //             <Route path="*" element={<Navigate to="/" replace />} />
                    //         </Routes>
                    //     </DefaultLayout>
                    // ) : (
                    //     <Navigate to="/auth/signin" replace />
                    // )

                    <>
                        <DefaultLayout>
                            <Routes>
                                {isAdmin ? (
                                    <>
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
                                                    <PageTitle title="Master Agen" />
                                                    <MasterWholesale />
                                                </>
                                            }
                                        />

                                        <Route
                                            path="reimburse_checking"
                                            element={
                                                <>
                                                    <PageTitle title="Reimburse Verification" />
                                                    <VerificationReimburse />
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
                                    </>) : (
                                    // NON ADMIN ROUTES
                                    <>
                                        <Route
                                            path="*"
                                            element={
                                                <>
                                                    <PageTitle title="Page Not Found" />
                                                    <div>Halaman tidak tersedia</div>
                                                </>
                                            }
                                        />
                                    </>
                                )}

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
                                    path="/reimbursement"
                                    element={
                                        <>
                                            <PageTitle title="Reimbursement" />
                                            <Reimbursement />
                                        </>
                                    }
                                />

                                {/* Redirect to dashboard if path is not found */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </DefaultLayout>
                    </>
                }
            />
        </Routes>
    );
};

export default AppRoutes;