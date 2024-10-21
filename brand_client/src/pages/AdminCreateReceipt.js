import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminCreateReceipt.css";
import SideMenu from "../components/SideMenu";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/v1/receipts`);
        setReceipts(response.data);
      } catch (error) {
        setError("Error fetching receipts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) {
    return <div className="receipts__loading">Loading receipts...</div>;
  }

  if (error) {
    return <div className="receipts__error">{error}</div>;
  }

  return (
    <div className="receipts__container">
      <h2 className="receipts__title">Receipts</h2>
      <table className="receipts__table">
        <thead className="receipts__thead">
          <tr>
            <th className="receipts__th">Client Name</th>
            <th className="receipts__th">Client Email</th>
            <th className="receipts__th">Total Amount</th>
            <th className="receipts__th">Payment Status</th>
            <th className="receipts__th">Payment Method</th>
            <th className="receipts__th">Trip Title</th>
            <th className="receipts__th">Trip Destination</th>
            <th className="receipts__th">Trip Duration</th>
          </tr>
        </thead>
        <tbody className="receipts__tbody">
          {receipts.map((receipt) => (
            <tr key={receipt._id} className="receipts__row">
              <td className="receipts__td">{receipt.clientName}</td>
              <td className="receipts__td">{receipt.clientEmail}</td>
              <td className="receipts__td">
                ${receipt.totalAmount.toFixed(2)}
              </td>
              <td className="receipts__td">{receipt.paymentStatus}</td>
              <td className="receipts__td">{receipt.paymentMethod || "N/A"}</td>
              <td className="receipts__td">{receipt.tripTitle || "N/A"}</td>
              <td className="receipts__td">
                {receipt.tripDestination || "N/A"}
              </td>
              <td className="receipts__td">
                {receipt.tripDuration.number} {receipt.tripDuration.period}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminCreateReceipt = () => {
  const [receiptType, setReceiptType] = useState("Trip");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    title: "",
    destination: "",
    duration: { number: 0, period: "days" },
    price: 0,
    guests: 1,
  });
  const [accommodationData, setAccommodationData] = useState({
    description: "",
    location: "",
    amenities: [],
    dailyRate: 0,
    days: 1,
  });
  const [message, setMessage] = useState("");
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    calculateTotal();
  }, [tripData, accommodationData, receiptType]);

  const calculateTotal = () => {
    let itemTotal = 0;

    if (receiptType === "Trip") {
      itemTotal += tripData.guests * tripData.price;
    } else if (receiptType === "Accommodation") {
      itemTotal += accommodationData.days * accommodationData.dailyRate;
    }

    setTotalAmount(itemTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const receiptData = {
      clientName,
      clientEmail,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes,
      ...(receiptType === "Trip" ? { tripData } : { accommodationData }),
    };

    try {
      await axios.post(`${serverUrl}/api/v1/receipts/create`, receiptData);
      setMessage("Receipt created successfully!");
      setClientName("");
      setClientEmail("");
      setTotalAmount(0);
      setPaymentStatus("Paid");
      setPaymentMethod("Credit Card");
      setNotes("");
      setTripData({
        title: "",
        destination: "",
        duration: { number: 0, period: "days" },
        price: 0,
        guests: 1,
      });
      setAccommodationData({
        description: "",
        location: "",
        amenities: [],
        dailyRate: 0,
        days: 1,
      });
    } catch (error) {
      setMessage("Error creating receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminReceipt-parentDiv">
      <SideMenu activeLink="receipts" admin={true} />
      <div className="admin-receipt-container">
        <h2>Create a Receipt</h2>
        {message && <p className="receipt-message">{message}</p>}

        <form onSubmit={handleSubmit} className="admin-receipt-form">
          <label htmlFor="receiptType">Receipt Type:</label>
          <select
            id="receiptType"
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
          >
            <option value="Trip">Trip</option>
            <option value="Accommodation">Accommodation</option>
          </select>

          <label htmlFor="clientName">Client Name:</label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />

          <label htmlFor="clientEmail">Client Email:</label>
          <input
            type="email"
            id="clientEmail"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />

          {receiptType === "Trip" && (
            <div className="trip-fields">
              <h3>Trip Details:</h3>
              <label htmlFor="tripTitle">Trip Title:</label>
              <input
                type="text"
                id="tripTitle"
                value={tripData.title}
                onChange={(e) =>
                  setTripData({ ...tripData, title: e.target.value })
                }
                required
              />
              <label htmlFor="tripDestination">Destination:</label>
              <input
                type="text"
                id="tripDestination"
                value={tripData.destination}
                onChange={(e) =>
                  setTripData({ ...tripData, destination: e.target.value })
                }
                required
              />
              <label htmlFor="tripDuration">Duration:</label>
              <div>
                <input
                  type="number"
                  value={tripData.duration.number}
                  onChange={(e) =>
                    setTripData({
                      ...tripData,
                      duration: {
                        ...tripData.duration,
                        number: e.target.value,
                      },
                    })
                  }
                  required
                />
                <select
                  value={tripData.duration.period}
                  onChange={(e) =>
                    setTripData({
                      ...tripData,
                      duration: {
                        ...tripData.duration,
                        period: e.target.value,
                      },
                    })
                  }
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
              <label htmlFor="tripGuests">Number of Guests:</label>
              <input
                type="number"
                id="tripGuests"
                value={tripData.guests}
                onChange={(e) =>
                  setTripData({ ...tripData, guests: e.target.value })
                }
                required
              />
              <label htmlFor="tripPrice">Trip Price per Guest:</label>
              <input
                type="number"
                id="tripPrice"
                value={tripData.price}
                onChange={(e) =>
                  setTripData({ ...tripData, price: e.target.value })
                }
                required
              />
            </div>
          )}

          {receiptType === "Accommodation" && (
            <div className="accommodation-fields">
              <h3>Accommodation Details:</h3>
              <label htmlFor="accommodationDescription">Description:</label>
              <input
                type="text"
                id="accommodationDescription"
                value={accommodationData.description}
                onChange={(e) =>
                  setAccommodationData({
                    ...accommodationData,
                    description: e.target.value,
                  })
                }
                required
              />
              <label htmlFor="accommodationLocation">Location:</label>
              <input
                type="text"
                id="accommodationLocation"
                value={accommodationData.location}
                onChange={(e) =>
                  setAccommodationData({
                    ...accommodationData,
                    location: e.target.value,
                  })
                }
                required
              />
              <label htmlFor="accommodationDays">Number of Days:</label>
              <input
                type="number"
                id="accommodationDays"
                value={accommodationData.days}
                onChange={(e) =>
                  setAccommodationData({
                    ...accommodationData,
                    days: e.target.value,
                  })
                }
                required
              />
              <label htmlFor="accommodationDailyRate">Daily Rate:</label>
              <input
                type="number"
                id="accommodationDailyRate"
                value={accommodationData.dailyRate}
                onChange={(e) =>
                  setAccommodationData({
                    ...accommodationData,
                    dailyRate: e.target.value,
                  })
                }
                required
              />
            </div>
          )}

          <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>

          <label htmlFor="paymentStatus">Payment Status:</label>
          <select
            id="paymentStatus"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Debit Card">Bank Transfer</option>
            <option value="Mpesa">Mpesa</option>
          </select>

          <label htmlFor="notes">Notes (Optional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Receipt..." : "Create Receipt"}
          </button>
        </form>
        <Receipts />
      </div>
    </div>
  );
};

export default AdminCreateReceipt;
