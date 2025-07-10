import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Renters.css'; 
import AdminNavbar from './AdminNavbar';

const Renters = () => {
  const [renters, setRenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRenters, setFilteredRenters] = useState([]);

  useEffect(() => {
    fetchRenters();
  }, []);

  const fetchRenters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/renters');
      setRenters(response.data);
      setFilteredRenters(response.data); // Initialize filtered renters
    } catch (error) {
      console.error('Error fetching renters:', error);
    }
  };

  const handleSearch = () => {
    const filtered = renters.filter((renter) =>
      renter.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRenters(filtered);
  };

  const deleteRenter = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/renter/${id}`);
      setRenters((prev) => prev.filter((renter) => renter._id !== id));
      setFilteredRenters((prev) => prev.filter((renter) => renter._id !== id));
    } catch (error) {
      console.error('Error deleting renter:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/auth/renter/${id}/toggle-status`);
      fetchRenters(); // Refresh the list
    } catch (error) {
      console.error('Error toggling renter status:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />

    
      <label
        className="mx-auto mt-8 mb-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
        htmlFor="search-bar"
      >
        <input
          id="search-bar"
          placeholder="Enter Email here"
          className="px-6 py-2 w-full rounded-xl flex-1 outline-none bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
        <button
          className="w-full md:w-auto px-6 py-3 bg-black border-black text-white active:scale-95 rounded-xl transition-all"
          onClick={handleSearch} // Trigger search
        >
          <span className="text-sm font-semibold truncate mx-auto">Search</span>
        </button>
      </label>
      <h1 className="text-center font-bold text-4xl underline pt-2 pb-3">Renters</h1>
      <div className="renter-container">
        {filteredRenters.length > 0 ? (
          filteredRenters.map((renter) => (
            <div key={renter._id} className="renter-card">
              <h3>{renter.email}</h3>
              <p>Status: {renter.isAllowed ? 'Allowed' : 'Disallowed'}</p>
              <div style={{ display: 'flex' }}>
                <button onClick={() => deleteRenter(renter._id)} style={{ marginRight: '5%' }}>
                  Delete
                </button>
                <button onClick={() => toggleStatus(renter._id)}>
                  {renter.isAllowed ? 'Disallow' : 'Allow'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No renters found.</p>
        )}
      </div>
    </div>
  );
};

export default Renters;
