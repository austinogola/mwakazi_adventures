import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import "../styles/BookingPage.css";
import axios from "axios";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState(null);
  const [details, setDetails] = useState(null);
  const [bookingType, setBookingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: 1,
    payment: "",
    totalPayment: "",
    depositPercentage: "100", // New state for deposit percentage
  });

  const [searchParams] = useSearchParams();
  const _id = searchParams.get("id");

  const bounceUrl = `/signup?bounce=booking?id=${_id}`;

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let response, data;

        response = await axios.get(`${serverUrl}/api/v1/trips/${_id}`, {
          headers: { "Content-Type": "application/json" },
        });
        data = response.data;

        if (data.trip && data.trip._id) {
          setBookingType("trip");
          setDetails(data.trip);
          return;
        }
      } catch (error) {
        console.warn("Error fetching trip details:", error.message);
      }

      try {
        const accommodationResponse = await axios.get(
          `${serverUrl}/api/v1/accommodations/${_id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const accommodationData = accommodationResponse.data;

        if (accommodationData && accommodationData._id) {
          setBookingType("accommodation");
          setDetails(accommodationData);
        } else {
          setErrorMsg("Details not found");
        }
      } catch (error) {
        console.error("Error fetching accommodation details:", error.message);
        setErrorMsg("Something went wrong while fetching the booking details.");
      }
    };

    if (_id) {
      fetchDetails();
    } else {
      setErrorMsg("Invalid booking ID.");
    }
  }, [_id, serverUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calculatePayment = () => {
    const total =
      (details.price || details.dailyRate) *
      (formData.days || 1) *
      (bookingType === "trip" ? formData.guests : 1);
    const depositPercentage = parseInt(formData.depositPercentage);
    const paymentAmount = (total * depositPercentage) / 100;
    return { paymentAmount, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { paymentAmount, total } = calculatePayment();

    const bookingData = {
      itemDetails: {
        ...details,
        guests: formData.guests,
        days: formData.days || 1,
        bookingType,
        paymentAmount,
        totalAmount: total,
        balance: total - paymentAmount,
      },
    };

    navigate(`/booking/proceed`, {
      state: bookingData,
    });
  };

  if (!details) {
    return <div className="loading">Loading details...</div>;
  }

  const { paymentAmount } = calculatePayment();

  return (
    <div className="booking-container">
      <header className="booking-header">
        <h1>
          {bookingType === "trip" ? "Trip Booking" : "Accommodation Booking"}
        </h1>
      </header>
      <main className="booking-main">
        <section className="trip-details">
          <h2>{details.title || details.description}</h2>
          <div className="trip-info">
            <img
              src={details.images[0]}
              alt={details.title || details.description}
              className="trip-image"
            />
            <div className="trip-text">
              {details.category && <p>Category: {details.category}</p>}
              {details.rating && <p>Rating: {details.rating} / 5</p>}
            </div>
          </div>
        </section>
        <section className="booking-form">
          <h2>Book Your {bookingType === "trip" ? "Trip" : "Accommodation"}</h2>
          <div className="booking-summary">
            <span style={{ marginRight: "20px", fontWeight: "bold" }}>
              Rate:{" "}
            </span>
            <span>{details.price || details.dailyRate} USD</span>
            {bookingType === "accommodation" && (
              <>
                <br />
                <span style={{ marginRight: "20px", fontWeight: "bold" }}>
                  Days:{" "}
                </span>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={formData.days}
                  min={1}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "50px",
                    display: "inline-block",
                    marginBottom: "20px",
                  }}
                />
              </>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            {bookingType === "trip" && (
              <div
                className="form-group"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label htmlFor="guests" style={{ marginRight: "10px" }}>
                  Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  required
                  min={1}
                  style={{ width: "50px" }}
                />
              </div>
            )}

            <span style={{ marginBottom: "100px", fontWeight: "bold" }}>
              <span style={{ marginRight: "10px" }}>
                Total Amount Payable:{" "}
              </span>
              <span>
                {(details.price || details.dailyRate) *
                  (formData.days || 1) *
                  (bookingType === "trip" ? formData.guests : 1)}{" "}
                USD
              </span>
            </span>

            <div className="form-group">
              <label htmlFor="depositPercentage">
                Select amount percentage to be paid
              </label>
              <select
                id="depositPercentage"
                name="depositPercentage"
                value={formData.depositPercentage}
                onChange={handleInputChange}
                required
              >
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
              </select>
            </div>

            <span style={{ marginBottom: "100px", fontWeight: "bold" }}>
              <span style={{ marginRight: "10px" }}>Payment Amount: </span>
              <span>{paymentAmount} USD</span>
            </span>

            <div className="form-group">
              <label htmlFor="payment">Payment Method</label>
              <select
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a payment method</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">Paypal</option>
                <option value="mpesa">Mpesa</option>
              </select>
            </div>
            <button type="submit" className="btn-book">
              Book Now
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default BookingPage;
