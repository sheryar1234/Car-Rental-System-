import React from "react";

const FilterPopup = ({
  tempFilters,
  handleFilterChange,
  handleApplyFilters,
  handleCloseFilters,
  cities,
}) => {
  return (
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
          <div className="relative">
            <input
              type="text"
              name="location"
              list="city-options"
              value={tempFilters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Type or select a city"
            />
            <datalist id="city-options">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
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
            min="0"
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
  );
};

export default FilterPopup;