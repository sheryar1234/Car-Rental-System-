import React, { useEffect, useState, useRef } from "react";
import AdminNavbar from "./AdminNavbar";

import axios from "axios";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ location: "", maxPrice: "" });
  const [tempFilters, setTempFilters] = useState({ location: "", maxPrice: "" });
  const [applyFilters, setApplyFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const menuRef = useRef(null);
  const popupRef = useRef(null);
  // Fetch vehicles when filters or searchTerm change
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setNoResults(false);

      try {
        let url = "http://localhost:5000/api/vehicles/all";

        if (searchTerm || filters.location || filters.maxPrice) {
          const params = new URLSearchParams({
            ...(searchTerm && { name: searchTerm }),
            ...(filters.location && { location: filters.location }),
            ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          });

          url = `http://localhost:5000/api/vehicles/car?${params}`;
        }

        const response = await axios.get(url);
        if (response.data.length === 0) {
          setNoResults(true);
        }

        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchTerm, filters]);

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleCloseFilters = () => {
    setTempFilters({ location: "", maxPrice: "" });
    setFilters({ location: "", maxPrice: "" });
    setShowFilters(false);
  };

  const handleFilterChange = (e) => {
    setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
  };

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      selectedVehicle
    ) {
      setSelectedVehicle(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div >
      <AdminNavbar />
      <label
        className="mx-auto mt-10 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
        htmlFor="search-bar"
      >
        <input
          id="search-bar"
          placeholder="Search your car here"
          className="px-6 py-2 w-full rounded-xl flex-1 outline-none bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          onClick={() => setShowFilters(!showFilters)}
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0113 14v6a1 1 0 01-.447.894l-4 2.667A1 1 0 017 22V14a1 1 0 01-.293-.707L3 6.707A1 1 0 013 6V4z"
          />
        </svg>
        <button
          className="w-full md:w-auto px-6 py-3 bg-black border-black text-white active:scale-95 rounded-xl transition-all"
          onClick={() => setSearchTerm(searchTerm)}
        >
          <span className="text-sm font-semibold truncate mx-auto">Search</span>
        </button>
      </label>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-black z-10"
              onClick={handleCloseFilters}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Options</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Location:</label>
              <input
                type="text"
                name="location"
                value={tempFilters.location}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter location"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Max Rent Price:</label>
              <input
                type="number"
                name="maxPrice"
                value={tempFilters.maxPrice}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter max price"
              />
            </div>
            <button
              onClick={handleApplyFilters}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <h1 ref={popupRef} className="text-center mt-10 text-3xl font-bold underline">Listed Vehicles</h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <p>Loading vehicles...</p>
        </div>
      ) : noResults ? (
        <div className="flex justify-center mt-20">
          <h1 className="text-3xl font-bold text-red-600">No vehicle found</h1>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 my-10">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-96"
            >
              <div className="relative h-60 overflow-hidden rounded-xl">
                <img
                  src={vehicle.carImage}
                  alt={vehicle.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex justify-between">
                  <p className="text-slate-800 text-xl font-semibold">{vehicle.name}</p>
                  <p className="text-cyan-600 text-xl font-semibold">${vehicle.rentPrice}</p>
                </div>
                <p className="text-gray-400">{vehicle.location}</p>
                <p className="text-slate-600 leading-normal line-clamp-3 h-20 py-1 font-light">{vehicle.description}</p>
                <button
                  className="text-cyan-600 text-sm hover:underline"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  Read More →
                </button>
               
              </div>
            </div>
          ))}
        </div>
      )}

{selectedVehicle && (
        <div
       
          className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div  ref={popupRef}  className="overflow-y-auto bg-white rounded-lg pt-6 pr-7 pl-6 w-3/4 md:w-2/5 shadow-lg relative ">
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-black z-10"
              onClick={() => setSelectedVehicle(null)}
            >
              ✕
            </button>
            <img
              src={selectedVehicle.carImage}
              alt={selectedVehicle.name}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{selectedVehicle.name}</h2>
            <div className=" max-h-60 mt-4">
              <p className="text-gray-600">{selectedVehicle.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;
