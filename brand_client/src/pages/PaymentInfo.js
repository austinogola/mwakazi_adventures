import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const PaymentInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemDetails, setItemDetails] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);
  const [bookingType, setBookingType] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [days, setDays] = useState(1);
  const [guests, setGuests] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("id");

  const today = new Date().toISOString().split("T")[0];
  const [cookies] = useCookies(["ma_auth_token"]);
  const ma_auth_token = cookies.ma_auth_token;

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (location.state && location.state.itemDetails) {
      const details = location.state.itemDetails;
      setItemDetails(details);
      setDays(details.days || 1);
      setGuests(details.guests || 1);
      setBookingType(details.bookingType);

      if (details.bookingType === "accommodation") {
        const startDate = new Date(today);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(details.days, 10));
        setFormData((prevState) => ({
          ...prevState,
          endDate: endDate.toISOString().split("T")[0],
        }));
      }
    }
  }, [location.state, today]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      const start = new Date(formData.startDate);
      const end = new Date(value);

      if (end <= start) {
        const adjustedEnd = new Date(start);
        adjustedEnd.setDate(start.getDate() + 1);
        setFormData((prevState) => ({
          ...prevState,
          endDate: adjustedEnd.toISOString().split("T")[0],
        }));
      } else {
        const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setDays(daysDifference);
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAccept = () => {
    window.open(redirectUrl, "_blank");
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const body = {
        itemDetails,
        isPaid: false,
        customer: formData,
      };

      const { data } = await axios.post(
        `${serverUrl}/api/v1/bookings/init`,
        body,
        {
          headers: {
            Authorization: `Bearer ${ma_auth_token}`,
          },
        }
      );

      console.log("Response data:", data);

      if (data.status === "fail") {
        setError(data.message);
      } else {
        setRedirectUrl(data.payment_obj.redirect_url);
        setShowPopup(true);
      }
    } catch (err) {
      setError("There was an error processing your request. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <span className="backArrow" onClick={() => navigate(-1)}>
        &#8592;
      </span>
      <h2>Complete Your Booking</h2>

      <div className="item-details">
        <h2>Item Details</h2>
        <p>
          <strong>Item:</strong>
          {bookingType === "trip"
            ? `${itemDetails.title} (X ${guests})`
            : `Accommodation - ${itemDetails.location} (X ${days} Days)`}
        </p>
        <p>
          <strong>Price:</strong> ${itemDetails.paymentAmount}
        </p>
        {bookingType === "accommodation" && (
          <>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || today}
                required
              />
            </div>
          </>
        )}
      </div>

      <h2>Traveller Details</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isLoading || !loggedIn}>
          {isLoading ? "Submitting..." : "Submit and Pay"}
        </button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Redirect to Payment</h2>
            <p>
              You are about to be redirected to complete your purchase. Do you
              want to continue?
            </p>
            <div className="popup-buttons">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleAccept}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {!loggedIn && (
        <div style={{ textAlign: "center", color: "red" }}>
          <p>You need to be signed in to proceed.</p>
          <Link to="/login" style={{ color: "blue", fontWeight: 500 }}>
            Sign in now
          </Link>
        </div>
      )}

      <style jsx>{`
        .backArrow {
          font-size: 2.5rem;
          font-weight: 600;
          cursor: pointer;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .error {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        input {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
        button {
          padding: 10px 15px;
          font-size: 18px;
          color: white;
          background-color: #28a745;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .popup-buttons {
          margin-top: 20px;
          display: flex;
          justify-content: space-around;
        }
        .popup-buttons button {
          padding: 10px 20px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default PaymentInfo;
