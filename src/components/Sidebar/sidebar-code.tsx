   {/* <SidebarLinkGroup
                    activeCondition={pathname === '/forms' || pathname.includes('forms')}
                  >
                    {(handleClick, open) => (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === '/forms' || pathname.includes('forms') ? 'bg-graydark dark:bg-meta-4' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          <NewspaperIcon className="h-6 w-6 text-white-500" />
                          Forms
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
                                to="/forms/form-elements"
                                className={({ isActive }) => `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive && '!text-white'}`}
                              >
                                Form Elements
                              </NavLink>
                            </li>

                            <li>
                              <NavLink
                                to="/forms/form-layout"
                                className={({ isActive }) => `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${isActive && '!text-white'}`}
                              >
                                Form Layout
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup> */}