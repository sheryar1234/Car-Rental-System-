import { useNavigate } from 'react-router-dom';

const MainLogin = () => {
  const navigate = useNavigate();

  // Handle navigation on button click
  const handleCustomerLoginClick = () => {
    navigate('/customer-login'); // Navigate to the login-customer route
  };
  const handleRenterLoginClick = () => {
    navigate('/renter-login'); // Navigate to the login-customer route
  };
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen from-teal-100 via-teal-300 to-teal-500 bg-[url('/login.png')] bg-cover bg-center">
        <div className="w-full max-w-lg px-10 py-8 mb-20 mx-auto bg-gray-200 bg-opacity-75 rounded-lg shadow-xl">
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex flex-col">
              <h1 className="mb-3 text-3xl text-gray-900 font-extrabold text-center">
                Login or Signup
              </h1>
              <button
                 onClick={handleRenterLoginClick}
               className="text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg hover:bg-indigo-800 h-12 px-6 m-2 text-lg">
                As Renter
              </button>
              <button
                onClick={handleCustomerLoginClick}
                className="text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg hover:bg-indigo-800 h-12 px-6 m-2 text-lg"
              >
                As Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
