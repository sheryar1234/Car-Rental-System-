import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-signup', { email, password });

      // Store the JWT token in localStorage or cookies for authentication
      localStorage.setItem('token', response.data.token);
  
      // Redirect user to login page or dashboard
      navigate('/adminDashboard');
    } catch (err) {
      setError('Error during signup'); // Display error message if signup fails
    }
  };

  return (
    <div className="relative h-full min-h-screen font-[sans-serif]">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bmw-m8-black.1920x1080.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex justify-end items-center h-full p-11 ">
        <div>
          <form onSubmit={handleAdminSignup} className="bg-opacity-90 bg-black rounded-2xl p-6 pl-14 pr-14 mt-12">
            <div className="mb-12">
              <h3 className="text-white text-3xl font-extrabold">Sign Up</h3>
            </div>

            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

            <div>
              <input
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent w-full text-sm text-white border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-white"
                placeholder="Enter email"
              />
            </div>

            <div className="mt-6">
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent w-full text-sm text-white border-b border-gray-400 focus:border-gray-800 px-2 py-3 outline-none placeholder:text-white"
                placeholder="Enter password"
              />
            </div>

          

            <div className="mt-12">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full bg-gray-300 hover:bg-[#2c2c31] hover:text-white focus:outline-none"
              >
                Sign up
              </button>
              <p className="text-white text-sm text-center mt-6">
                Already have an account?
                <a
                  onClick={() => navigate('/admin-login')}
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  SignIn here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
