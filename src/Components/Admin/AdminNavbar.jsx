import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';  // Importing Link from react-router-dom

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img className="h-9 w-auto" src="/logo.png" alt="Your Company" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
      <Link
        to="/adminDashboard"
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          location.pathname === '/adminDashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        aria-current="page"
      >
        Dashboard
      </Link>
      <Link
        to="/customers"
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          location.pathname === '/customers' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        Customers
      </Link>
      <Link
        to="/renters"
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          location.pathname === '/renters' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        Renters
      </Link>
      <Link
        to="/customer-reports"
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          location.pathname === '/customer-reports' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
       Customer Reports
      </Link>
      <Link
        to="/renter-reports"
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          location.pathname === '/renter-reports' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
       Renter Reports
      </Link>
    </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>

              <div className="relative ml-3" ref={menuRef}>
                <div>
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white ring-offset-2 ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="size-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      to="/profile"  // Use <Link> for navigation
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"  // Use <Link> for navigation
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/signout"  // Use <Link> for navigation
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;
