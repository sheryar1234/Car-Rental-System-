import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Customers.css';
import AdminNavbar from './AdminNavbar';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/customers');
      setCustomers(response.data);
      setFilteredCustomers(response.data); // Initialize filtered customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = () => {
    const filtered = customers.filter((customer) =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/customer/${id}`);
      setCustomers((prev) => prev.filter((user) => user._id !== id));
      setFilteredCustomers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/auth/customer/${id}/toggle-status`);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Error toggling customer status:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />

     
      <label
        className="mx-auto mt-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
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
      <h1 className="text-center font-bold text-4xl underline pt-6 pb-4">Customers</h1>
      <div className="customer-container">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <h3>{customer.email}</h3>
              <p>Status: {customer.isAllowed ? 'Allowed' : 'Disallowed'}</p>
              <div style={{ display: 'flex' }}>
                <button onClick={() => deleteUser(customer._id)} style={{ marginRight: '5%' }}>
                  Delete
                </button>
                <button onClick={() => toggleStatus(customer._id)}>
                  {customer.isAllowed ? 'Disallow' : 'Allow'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
