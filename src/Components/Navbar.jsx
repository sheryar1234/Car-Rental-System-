import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img className="h-9 w-auto bg-white" src="/logo.png" alt="Your Company" />
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              <Link to="/customerDashboard" className="rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-900">
                Dashboard
              </Link>
              <Link to="/bookings" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Bookings
              </Link>
              <Link to="/compare" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Compare Vehicles
              </Link>
              <Link to="/chat" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Chat
              </Link>
              <Link to="/customer-report" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Report an Issue
              </Link>
              <Link to="/estimate" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                More
              </Link>
              
          
             
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-3" ref={menuRef}>
            <button
              type="button"
              onClick={toggleMenu}
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white ring-offset-2 ring-offset-gray-800"
            >
              <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700">
                  Your Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700">
                  Settings
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
