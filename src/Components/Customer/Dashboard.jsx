import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import { carNames, cities } from "./CityandCarData";
import axios from "axios";
import VehiclePopup from "./VehiclePopup";
import FilterPopup from "./FilterPopup";
import ReservePopup from "./ReservePopup";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ location: "", maxPrice: "" });
  const [tempFilters, setTempFilters] = useState({ location: "", maxPrice: "" });
  const [applyFilters, setApplyFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showReservePopup, setShowReservePopup] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    vehicleName: "",
    carImage: null,
    licenseImage: null,
    idCardImage: null,
    paymentReceipt: null,
  });
  const [totalCost, setTotalCost] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // 'success' or 'error'
  });

  const menuRef = useRef(null);
  const popupRef = useRef(null);

  // Fetch vehicles and driver rating
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
        const availableVehicles = response.data.filter(vehicle => 
          vehicle.status === "Available"
        );
        
        setVehicles(availableVehicles);
        
        if (availableVehicles.length === 0) {
          setNoResults(true);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchDriverRating = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/average?driverEmail=${userEmail}`);
        setDriverRating(response.data.averageRating || 0);
      } catch (error) {
        console.error("Error fetching driver rating:", error);
      }
    };

    fetchVehicles();
    fetchDriverRating();
  }, [searchTerm, filters]);

  // Filter vehicles based on driver rating
  useEffect(() => {
    if (vehicles.length > 0) {
      const filtered = vehicles.filter(vehicle => 
        driverRating >= vehicle.minDriverRating
      );
      setFilteredVehicles(filtered);
      setNoResults(filtered.length === 0);
    }
  }, [vehicles, driverRating]);

  // Check if the Reserve Now button should be disabled
  const isReserveDisabled = (vehicle) => {
    return vehicle.status !== "Available" || driverRating < vehicle.minDriverRating;
  };

  // Handle filter changes
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

  // Handle clicking outside the popup
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

  // Handle reservation submission
  const handleReserveSubmit = async (formData) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      showNotification("User is not authenticated. Please log in.", "error");
      return;
    }

    const data = new FormData();
    data.append("fromDate", formData.fromDate);
    data.append("toDate", formData.toDate);
    data.append("licenseImage", formData.licenseImage);
    data.append("idCardImage", formData.idCardImage);
    data.append("paymentReceipt", formData.paymentReceipt);
    data.append("carImage", selectedVehicle.carImage);
    data.append("vehicleId", selectedVehicle._id);
    data.append("vehicleName", selectedVehicle.name);
    data.append("totalCost", totalCost);
    data.append("userEmail", userEmail);
    data.append("renterEmail", selectedVehicle.email);

    try {
      await axios.post("http://localhost:5000/api/bookings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification("Booking successful!", "success");
      setShowReservePopup(false);
      
      // Refresh the vehicle list
      const response = await axios.get("http://localhost:5000/api/vehicles/all");
      const availableVehicles = response.data.filter(vehicle => 
        vehicle.status === "Available"
      );
      setVehicles(availableVehicles);
    } catch (error) {
      console.error("Error booking vehicle:", error);
      showNotification("Booking failed. Please try again.", "error");
    }
  };

  // Show notification function
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  return (
    <div className="relative">
      <Navbar />
      
      {/* Notification */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        notification.show ? "translate-y-0" : "-translate-y-full"
      }`}>
        {notification.show && (
          <div className={`mt-4 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success" 
              ? "bg-green-100 border-green-400 text-green-700" 
              : "bg-red-100 border-red-400 text-red-700"
          } border-l-4`}>
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-semibold">{notification.message}</span>
            </div>
          </div>
        )}
      </div>

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
          list="car-options"
        />
        <datalist id="car-options">
          {carNames.map((car) => (
            <option key={car} value={car} />
          ))}
        </datalist>

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

      {showFilters && (
        <FilterPopup
          tempFilters={tempFilters}
          handleFilterChange={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
          handleCloseFilters={handleCloseFilters}
          cities={cities}
        />
      )}

      <h1 ref={popupRef} className="text-center mt-10 text-3xl font-bold underline">Recommended</h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <p>Loading vehicles...</p>
        </div>
      ) : noResults ? (
        <div className="flex justify-center mt-20">
          <h1 className="text-3xl font-bold text-red-600">
            {filteredVehicles.length === 0 && vehicles.length > 0 
              ? "No vehicles match your driver rating" 
              : "No available vehicles found"}
          </h1>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 my-10">
          {filteredVehicles.map((vehicle) => (
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
                  <p className="text-cyan-600 text-xl font-semibold">Rs {vehicle.rentPrice}</p>
                </div>
                <div className="flex">
                  <p className="text-gray-400 ">{vehicle.location}</p>
                  <p className="text-green-600 ml-auto font-semibold">Available</p>
                </div>
               
                <p className="text-slate-600 leading-normal line-clamp-3 h-20 py-1 font-light">{vehicle.description}</p>
                <button
                  className="text-cyan-600 text-sm hover:underline"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  Read More →
                </button>
                <button
                  className={`w-full mt-3 bg-gray-800 text-white py-2 rounded-lg border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none ${
                    isReserveDisabled(vehicle) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (!isReserveDisabled(vehicle)) {
                      setSelectedVehicle(vehicle);
                      setShowReservePopup(true);
                    }
                  }}
                  disabled={isReserveDisabled(vehicle)}
                >
                  Reserve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVehicle && (
        <VehiclePopup
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {showReservePopup && (
        <ReservePopup
          vehicle={selectedVehicle}
          onClose={() => setShowReservePopup(false)}
          onSubmit={handleReserveSubmit}
          formData={formData}
          setFormData={setFormData}
          totalCost={totalCost}
          setTotalCost={setTotalCost}
        />
      )}
    </div>
  );
};

export default Dashboard;