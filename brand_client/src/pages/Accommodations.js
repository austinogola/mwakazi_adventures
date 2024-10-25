import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ResponsiveFooter from "../components/ResponsiveFooter";
import NewHeader from "../components/NewHeader";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="circle circle1"></div>
    <div className="circle circle2"></div>
    <div className="circle circle3"></div>
    <div className="circle circle4"></div>
  </div>
);

const Accommodations = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/accommodations`
        );
        const data = await response.json();
        setAccommodations(data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <NewHeader />
      <Navbar />
      <div className="accommodations-container">
        <h1>Accommodations</h1>
        {accommodations.map((accommodation, index) => (
          <div key={index} className="accommodation-item">
            <img
              src={accommodation.images[0]}
              alt="Accommodation"
              className="accommodation-image"
            />
            <p>{accommodation.description}</p>
            <p>Location: {accommodation.location}</p>
            <p>Amenities: {accommodation.amenities.join(", ")}</p>
            <p>Daily Rate: ${accommodation.dailyRate}</p>
            <button
              className="book-now-button"
              onClick={() => navigate(`/booking?id=${accommodation._id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
      <ResponsiveFooter />
    </div>
  );
};

export default Accommodations;
