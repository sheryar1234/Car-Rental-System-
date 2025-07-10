import React, { useState } from 'react';
import Navbar from '../Navbar';

const Estimation = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [mileage, setMileage] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelNeeded, setFuelNeeded] = useState(null);

  const calculateFuel = () => {
    if (mileage > 0 && distance > 0) {
      const estimatedFuel = (distance / mileage).toFixed(2);
      setFuelNeeded(estimatedFuel);
    } else {
      setFuelNeeded('Invalid input');
    }
  };

  const addExpenseField = () => {
    setExpenses([...expenses, { name: '', cost: '' }]);
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const calculateExpenses = () => {
    const total = expenses.reduce((sum, exp) => sum + (parseFloat(exp.cost) || 0), 0);
    setTotalExpense(total.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white p-6 mt-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Trip Fuel Estimation</h1>
        
        <button
          onClick={() => setShowInputs(true)}
          className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Calculate Estimated Trip Fuel
        </button>

        {showInputs && (
          <div className="mt-4">
            <label className="block font-medium mb-2">Car Mileage (km per litre)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Enter mileage"
              min={0}
            />

            <label className="block font-medium mt-3 mb-2">Trip Distance (km)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance"
              min={0}
            />

            <button
              onClick={calculateFuel}
              className="w-full bg-green-600 text-white mt-4 px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Calculate Fuel
            </button>

            {fuelNeeded !== null && (
              <p className="mt-4 text-lg font-semibold text-center">
                Estimated Fuel Needed: <span className="text-blue-600">{fuelNeeded} Litres</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 mt-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Calculate Trip Expense</h1>

        <div className="mt-4">
         
          {expenses.map((expense, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="Expense Name"
                value={expense.name}
                onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                className="p-2 border rounded-lg"
                placeholder="Cost"
                value={expense.cost}
                onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
                min={0}
              />
            </div>
          ))}

          <button
            onClick={addExpenseField}
            className="w-full bg-gray-700 text-white mt-2 px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
          >
            Add Expense
          </button>
        </div>

        <button
          onClick={calculateExpenses}
          className="w-full bg-red-600 text-white mt-4 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Calculate Expenses
        </button>

        {totalExpense !== null && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg text-gray-600 font-semibold text-center mb-2">Expense Breakdown</h3>
            <ul className="mb-2">
              {expenses.map((expense, index) => (
                <li key={index} className="flex justify-between">
                  <span className='font-semibold'>{expense.name} </span> <span >{expense.cost}</span>
                </li>
              ))}
            </ul>
            <hr className="my-2" />
            <p className="text-lg font-semibold text-center">Total Trip Expense: <span  className='text-cyan-600 ml-4'>{totalExpense} PKR</span> </p>

       
          </div>
        )}
      </div>
    </div>
  );
};

export default Estimation;
