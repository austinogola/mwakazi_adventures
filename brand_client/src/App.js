import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Blogs from "./pages/Blogs";
import BookingPage from "./pages/Booking";
import Destinations from "./pages/Destinations";
import PaymentInfo from "./pages/PaymentInfo";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BookingInfo from "./pages/BookingInfo";
import About from "./pages/About";
import Accommodations from "./pages/Accommodations";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import TripPage from "./pages/TripPage";
import AdminTrips from "./pages/AdminTrips";
import AdminActivities from "./pages/AdminActivities";
import AdminDests from "./pages/AdminDests";
import EditTrip from "./pages/EditTrip";
import EditDestination from "./pages/editDestination";
import AdminInvoices from "./pages/AdminInvoices";
// import HomePage from './pages/HomePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/booking/info" element={<BookingInfo />} />
        <Route path="/booking/proceed" element={<PaymentInfo />} />
        <Route path="/trip-view" element={<TripPage />} />
        <Route path="/admin/activities" element={<AdminActivities />} />
        <Route path="/admin/trips" element={<AdminTrips />} />
        <Route path="admin/destinations" element={<AdminDests />} />
        <Route path="admin/edit-trip" element={<EditTrip />} />
        <Route path="admin/edit-destination" element={<EditDestination />} />
        <Route path="admin/invoices" element={<AdminInvoices />} />
        {/* <Route path="/destinations" element={<Destinations />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/activities" element={<Activities />} /> */}
        {/* <Route path="/admin" element={<Admin3 />} />
        <Route path="/admin/trips/add" element={<AdminAddTrip />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
