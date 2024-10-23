import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import "../styles/AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/v1/bookings`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch bookings.");
        }

        setBookings(data.bookings);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="bookings-loading">Loading bookings...</p>;
  if (error) return <p className="bookings-error">Error: {error}</p>;

  return (
    <div className="bookings-parentDiv">
      <SideMenu activeLink="bookings" admin={true} />
      <div className="bookings-list-container">
        <h2 className="bookings-list-title">All Bookings</h2>
        {bookings.length === 0 ? (
          <p className="bookings-no-data">No bookings available.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3 className="booking-type">
                  {booking.item_details?.type?.toUpperCase() || "N/A"}
                </h3>
                <p className="booking-customer">
                  <strong>Customer:</strong> {booking.customer?.firstName}{" "}
                  {booking.customer?.lastName || "Unknown"}
                </p>
                <p className="booking-customer">
                  <strong>Email:</strong> {booking.customer?.email || "Unknown"}
                </p>
                <p className="booking-paid">
                  <strong>Paid:</strong> {booking.isPaid ? "Yes" : "No"}
                </p>
                <p className="booking-details">
                  <strong>Title:</strong>{" "}
                  {booking.item_details?.title || "No details available"}
                </p>
                <p className="booking-order-id">
                  <strong>Order ID:</strong> {booking.orderId || "Not assigned"}
                </p>
                <p className="booking-date">
                  <strong>Date:</strong>{" "}
                  {booking.created_at
                    ? new Date(booking.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
