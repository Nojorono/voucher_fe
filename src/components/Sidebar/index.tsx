import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import {
  HomeIcon, UserIcon, CheckCircleIcon, CogIcon,
  NewspaperIcon, ChevronDownIcon, GiftIcon, UserPlusIcon
} from '@heroicons/react/24/solid';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === 'true');

  const getUserRole = localStorage.getItem('is_staff') === 'true';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };

    const handleEscKey = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    document.querySelector('body')?.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = (tokenPayload.exp * 1000 < Date.now()) || (Date.now() - (tokenPayload.iat * 1000) > 2 * 60 * 60 * 1000);
        if (isExpired) {
          localStorage.removeItem('token');
          navigate('/auth/signin');
        }
      }
    };

    checkTokenExpiration();
  }, [token, navigate]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        {/* <NavLink to="/profile">
          <img src={Logo} alt="Logo" />
        </NavLink> */}

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {getUserRole ? (
                <>
                  {/* <li>
                    <NavLink
                      to="/dashboard"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('dashboard') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <HomeIcon className="h-6 w-6 text-white-500" />
                      Dashboard
                    </NavLink>
                  </li> */}


                  <SidebarLinkGroup
                    activeCondition={pathname === '/dashboard' || pathname.includes('dashboard')}
                  >
                    {(handleClick, open) => (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 
                            ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/dashboard' || pathname.includes('dashboard') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <NewspaperIcon className="h-6 w-6 text-white-500" />
                          Dashboard
                          <ChevronDownIcon
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                            width={20}
                            height={20}
                          />
                        </NavLink>

                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/dashboard/dashboard_retailer"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                                  ${pathname.includes('/dashboard/dashboard_retailer') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Dashboard Retailer
                              </NavLink>
                            </li>

                            <li>
                              <NavLink
                                to="/dashboard/dashboard_voucher"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                                  ${pathname.includes('/dashboard/dashboard_voucher') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Dashboard Voucher
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup>

                  <li>
                    <NavLink
                      to="/verification"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium
                     text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('verification') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <CheckCircleIcon className="h-6 w-6 text-white-500" />
                      Verification
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/user_register"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium
                     text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('user_register') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <UserPlusIcon className="h-6 w-6 text-white-500" />
                      User Register
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                        font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <UserIcon className="h-6 w-6 text-white-500" />
                      Profile
                    </NavLink>
                  </li>



                  <SidebarLinkGroup
                    activeCondition={pathname === '/master_data' || pathname.includes('master_data')}
                  >
                    {(handleClick, open) => (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 
                            ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/master_data' || pathname.includes('master_data') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <NewspaperIcon className="h-6 w-6 text-white-500" />
                          Master Data
                          <ChevronDownIcon
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                            width={20}
                            height={20}
                          />
                        </NavLink>

                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/master_data/master_wholesale"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/master_data/master_wholesale') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Master Wholesale
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup>
                </>
              ) : (
                <>
                  {/* <li>
                    <NavLink
                      to="/dashboard"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('dashboard') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <HomeIcon className="h-6 w-6 text-white-500" />
                      Dashboard
                    </NavLink>
                  </li> */}

                  <li>
                    <NavLink
                      to="/profile"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <UserIcon className="h-6 w-6 text-white-500" />
                      Profile
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/redeem"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('redeem') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <GiftIcon className="h-6 w-6 text-white-500" />
                      Redeem Voucher
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
