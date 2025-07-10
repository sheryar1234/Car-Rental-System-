import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RenterProfilePanel = ({ onClose }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [driverRating, setDriverRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    const role = localStorage.getItem('userRole') || 'user';
    const name = localStorage.getItem('userName') || 'User Name';
    
    setUserEmail(email);
    setUserRole(role);
    setEditedName(name);

    if (role === 'driver') {
      fetchDriverRating(email);
    } else {
      setLoadingRating(false);
    }
  }, []);

  const fetchDriverRating = async (email) => {
    try {
      setLoadingRating(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/average', {
        params: { driverEmail: email },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDriverRating(response.data.averageRating || 0);
    } catch (error) {
      console.error('Rating fetch error:', error);
      setError('Failed to load rating');
      setDriverRating(0);
    } finally {
      setLoadingRating(false);
    }
  };

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    
    // Navigate to the main page
    navigate('/');
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem('userName', editedName);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="h-full p-6 overflow-y-auto bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" 
              src={profileImage} 
              alt="Profile" 
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="text-center">
            {isEditing ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  className="text-xl font-semibold text-center border-b-2 border-blue-500 focus:outline-none"
                />
                <div className="mt-2 flex justify-center space-x-2">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800">{editedName}</h3>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-1 text-sm text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Edit Name
                </button>
              </>
            )}
            <p className="text-gray-600 mt-2">{userEmail}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
              {userRole}
            </span>

            {userRole === 'driver' && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Driver Rating</p>
                <div className="flex justify-center items-center mt-1">
                  {loadingRating ? (
                    <p className="text-sm text-gray-500">Loading rating...</p>
                  ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                  ) : (
                    <>
                      <div className="flex">
                        {renderStars(driverRating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({driverRating.toFixed(1)}/5.0)
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">Account Settings</h4>
          <ul className="space-y-3">
            <li>
              <button 
                className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors text-gray-700 border border-gray-200"
                onClick={() => setIsEditing(true)}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </button>
            </li>
            <li>
              <button 
                className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors text-gray-700 border border-gray-200"
                onClick={handleSignOut}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RenterProfilePanel;