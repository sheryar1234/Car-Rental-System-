import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { CarFront } from 'lucide-react'; 

const Comparison = () => {
  const [carsData, setCarsData] = useState([]);
  const [car1Name, setCar1Name] = useState('');
  const [car2Name, setCar2Name] = useState('');
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);

  useEffect(() => {
    fetch('/pakistan_local_cars_dummy_data.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.trim().split('\n');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            "Car Name": values[0],
            "Variant": values[1],
            "Fuel Mileage (km/l)": values[2],
            "Features": values.slice(3).join(','),
          };
        });
        setCarsData(data);
      });
  }, []);

  const compareCars = () => {
    setCar1(carsData.find(car => car["Car Name"].toLowerCase() === car1Name.toLowerCase()));
    setCar2(carsData.find(car => car["Car Name"].toLowerCase() === car2Name.toLowerCase()));
  };

  const carNames = [...new Set(carsData.map(car => car["Car Name"]))];

  return (
    <div className="min-h-screen bg-gradient-to-r bg-gray-100 ">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center ">Car Comparison</h2>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 ml-32">
          <div>
            <input
              type="text"
              list="car-list"
              placeholder="Enter or select first car"
              value={car1Name}
              onChange={(e) => setCar1Name(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 shadow-md w-72"
            />
          </div>
          <div>
            <input
              type="text"
              list="car-list"
              placeholder="Enter or select second car"
              value={car2Name}
              onChange={(e) => setCar2Name(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 shadow-md w-72 ml-4"
            />
          </div>
          <button
            onClick={compareCars}
            className="px-5 py-3 bg-cyan-600 text-white rounded-xl shadow-lg hover:bg-cyan-700 transition duration-200"
          >
            Compare
          </button>

          <datalist id="car-list">
            {carNames.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>

        {/* Result Section */}
        {car1 && car2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[car1, car2].map((car, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:scale-104 transform transition duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CarFront className="text-cyan-500" />
                  <h3 className="text-2xl font-bold text-cyan-700">{car["Car Name"]}</h3>
                </div>
                <p className="mb-2 text-gray-800">
                  <span className="font-semibold text-gray-600">Variant:</span> {car["Variant"]}
                </p>
                <p className="mb-2 text-gray-800">
                  <span className="font-semibold text-gray-600">Fuel Mileage:</span> {car["Fuel Mileage (km/l)"]} km/l
                </p>
                <p className="font-semibold mb-2 text-gray-700">Key Features:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  {car["Features"].split(',').map((feature, i) => (
                    <li key={i}>{feature.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-600 mt-6 text-lg">Enter valid car names to compare.</p>
        )}
      </div>
    </div>
  );
};

export default Comparison;
