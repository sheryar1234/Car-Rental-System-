import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerLogin from './Components/Customer/CustomerLogin';
import MainLogin from './Components/MainLogin';
import CustomerSignup from './Components/Customer/CustomerSignup';
import AdminSignup from './Components/Admin/AdminSignup';
import RenterLogin from './Components/Renter/RenterLogin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import RenterSignup from './Components/Renter/RenterSignup';
import Dashboard from './Components/Customer/Dashboard';
import AdminLogin from './Components/Admin/AdminLogin';
import Customers from './Components/Admin/Customers';
import Renters from './Components/Admin/Renters';
import RenterDashboard from './Components/Renter/RenterDashboard';
import Estimation from './Components/Customer/Estimation';
import Bookings from './Components/Customer/Bookings';
import BookingRequests from './Components/Renter/BookingRequests';
import ConfirmedBookings from './Components/Renter/ConfirmedBookings';
import RecievedBookings from './Components/Renter/RecievedBookings';
import ReportsByRenter from "./Components/Admin/ReportsByRenter";
import RenterReport from "./Components/Renter/RenterReport";
import CustomerReport from "./Components/Customer/CustomerReport";
import ReportsByCustomer from "./Components/Admin/ReportsByCustomer";
import Comparison from './Components/Customer/Comparison';
import GroupChat from './Components/Customer/GroupChat'
function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<MainLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/customer-signup" element={<CustomerSignup />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/renter-login" element={<RenterLogin />} />
        <Route path="/renter-signup" element={<RenterSignup />} />
        <Route path="/customerDashboard" element={<Dashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/renterDashboard" element={<RenterDashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/renters" element={<Renters/>} />
        <Route path="/estimate" element={<Estimation/>} />
        <Route path="/bookings" element={<Bookings/>} />
        <Route path="/bookingRequests" element={<BookingRequests/>} />
        <Route path="/confirmedBookings" element={<ConfirmedBookings/>} />
        <Route path="/recievedBookings" element={<RecievedBookings/>} />
        <Route path="/customer-reports" element={<ReportsByCustomer />} />
        <Route path="/renter-reports" element={<ReportsByRenter />} />
        <Route path="/renter-report" element={<RenterReport />} />
        <Route path="/customer-report" element={<CustomerReport />} />
        <Route path="/compare" element={<Comparison/>}/>
        <Route path="/chat" element={<GroupChat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
