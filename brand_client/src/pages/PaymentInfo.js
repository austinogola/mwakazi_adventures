import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useCookies } from "react-cookie";

const PaymentInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemDetails, setItemDetails] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingType, setBookingType] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [detailsSet, setDetailsSet] = useState(false);
  const [Days, setDays] = useState(1);
  const [Guests, setGuests] = useState(1);

  const [searchParams] = useSearchParams();
  const _id = searchParams.get("id");

  const today = new Date().toISOString().split("T")[0];

  const [cookies] = useCookies(["ma_auth_token"]);
  const ma_auth_token = cookies.ma_auth_token;

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (bookingType === "accommodation" && itemDetails.days) {
      const startDate = new Date(today);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(itemDetails.days, 10));
      setFormData((prevState) => ({
        ...prevState,
        endDate: endDate.toISOString().split("T")[0],
      }));
    }

    if (location.state && location.state.itemDetails && !detailsSet) {
      setDetailsSet(true);
      console.log("Setting");
      setItemDetails(location.state.itemDetails);
      setDays(location.state.itemDetails.days);
      setGuests(location.state.itemDetails.guests);
      setBookingType(location.state.itemDetails.bookingType);
    }
  }, [bookingType, itemDetails, today, location.state]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      const startDate = document.querySelector("#startDate");
      const endDate = document.querySelector("#endDate");

      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      const differenceInDays = (end - start) / (1000 * 60 * 60 * 24);
      console.log(differenceInDays);
      if (differenceInDays < 1) {
        console.log("Running here");
        end.setDate(start.getDate() + 1);
        const adjustedEndDate = end.toISOString().split("T")[0];
        endDate.value = adjustedEndDate;

        return handleChange(e);
      } else {
        setDays(differenceInDays);
      }

      // setItemDetails({...itemDetails,days:differenceInDays})
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(formData);
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
        isPaid: false,
        customer: formData,
        days: Days,
        guests: Guests,
      };

      body[bookingType] = itemDetails._id;
      body.paymentAmount = itemDetails.paymentAmount;
      body.totalAmountPayable = itemDetails.totalAmount;

      if (bookingType === "accommodation") {
        body.startDate = formData.startDate;
        body.endDate = formData.endDate;
      }

      const response = await fetch(`${serverUrl}/api/v1/bookings/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ma_auth_token}`,
        },
        body: JSON.stringify(body),
      });

      const res = await response.json();

      if (res.status === "fail") {
        setError(res.message);
        return;
      }

      const { payment_obj } = res;
      if (payment_obj.error) {
        setError(payment_obj.error.message);
        return;
      }

      setRedirectUrl(payment_obj.redirect_url);
      setShowPopup(true);
    } catch (error) {
      console.error("Error:", error);
      setError("There was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <span className="backArrow" onClick={goBack}>
        &#8592;
      </span>
      <h2>Complete Your Booking</h2>
      <div>
        <div className="item-details">
          <h2>Item Details</h2>
          <p>
            <strong style={{ marginRight: "10px" }}>Item:</strong>
            {bookingType === "trip"
              ? `${itemDetails.title} (X ${Guests})`
              : `Accommodation - ${itemDetails.location} (X ${Days} Days)`}
          </p>
          <p>
            <strong style={{ marginRight: "10px" }}>Price:</strong>$
            {bookingType === "trip"
              ? itemDetails.paymentAmount
              : itemDetails.dailyRate * parseInt(Days, 10)}
          </p>
          {bookingType === "accommodation" && (
            <>
              <div className="form-group">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate || today}
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
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  required
                />
              </div>
            </>
          )}
        </div>
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
        h1 {
          text-align: center;
          color: #333;
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
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input,
        textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        textarea {
          height: 100px;
        }
        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 400px;
        }
        .popup h2 {
          margin-top: 0;
        }
        .popup-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .popup button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .popup button:first-child {
          background-color: #f44336;
          color: white;
        }
        .popup button:last-child {
          background-color: #4caf50;
          color: white;
          margin-left: 20px;
        }
        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentInfo;
