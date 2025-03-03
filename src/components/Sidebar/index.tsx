import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import {
  CurrencyDollarIcon, CheckCircleIcon,
  NewspaperIcon, ChevronDownIcon, GiftIcon, ListBulletIcon, TicketIcon, DocumentCurrencyDollarIcon
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

  const adminRole = localStorage.getItem('is_staff') === 'true';

  // State untuk mengecek apakah token kedaluwarsa
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Handle click di luar sidebar dan tekan tombol Escape
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

  // Menyimpan status sidebar-expanded ke localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    document.querySelector('body')?.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  // Mengecek token dan apakah sudah kedaluwarsa
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
      const isExpired = (tokenPayload.exp * 1000 < Date.now()) || (Date.now() - (tokenPayload.iat * 1000) > 2 * 60 * 60 * 1000);
      setIsTokenExpired(isExpired); // Set apakah token kedaluwarsa
    }
  }, []);

  // Redirect ke halaman SignIn jika token kedaluwarsa
  useEffect(() => {
    if (isTokenExpired) {
      localStorage.removeItem('token');
      navigate('/auth/signin');
    }
  }, [isTokenExpired, navigate]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">

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
              {adminRole ? 'ADMIN DASHBOARD' : 'AGEN DASHBOARD'}
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {adminRole ? (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/dashboard_retailer"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                                  ${pathname.includes('/dashboard/dashboard_retailer') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <ListBulletIcon className="h-6 w-6 text-white-500" />
                      All Retailers
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/verification"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium
                     text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('verification') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <CheckCircleIcon className="h-6 w-6 text-white-500" />
                      Photo Verification
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="reimburse_checking"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                                  ${pathname.includes('reimburse_checking') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <DocumentCurrencyDollarIcon className="h-6 w-6 text-white-500" />
                      Reimburse Verification
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
                          <ul className="mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/master_data/master_wholesale"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/master_data/master_wholesale') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Master Agen
                              </NavLink>
                            </li>
                          </ul>

                          <ul className="mt-2 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/master_data/user_register"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/master_data/user_register') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Master User
                              </NavLink>
                            </li>
                          </ul>

                          <ul className="mt-2 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/master_data/master_voucher_limit"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
                                  font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/master_data/master_voucher_limit') && 'bg-graydark dark:bg-meta-4'}`}
                              >
                                Master Voucher Limit
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
                  <li>
                    <NavLink
                      to="/how-to-claim"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('how-to-claim') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <TicketIcon className="h-6 w-6 text-white-500" />
                      Cara Claim Voucher
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

                  <li>
                    <NavLink
                      to="/reimbursement"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('reimbursement') && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      <CurrencyDollarIcon className="h-6 w-6 text-white-500" />
                      Reimbursement
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
