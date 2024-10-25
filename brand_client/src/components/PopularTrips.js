import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/PopularTrips.css";

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="circle circle1"></div>
    <div className="circle circle2"></div>
    <div className="circle circle3"></div>
    <div className="circle circle4"></div>
  </div>
);

const PopularTrips = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showItems, setShowItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleBookNow = useCallback(
    (item) => {
      navigate(`/booking?id=${item._id}`, { state: { tripDetails: item } });
    },
    [navigate]
  );

  const fetchPopularTrips = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/trips?size=3`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      setShowItems(response.trips);
    } catch (error) {
      console.error("Error fetching popular trips:", error);
    } finally {
      setIsLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchPopularTrips();
  }, [fetchPopularTrips]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="popular-trips">
      <div className="titleHolder">
        <span>Popular</span>
        <span>Trips</span>
      </div>

      <div className="items-holder">
        {showItems.slice(0, 6).map((item) => (
          <div
            key={item._id}
            className="itemHolder"
            onMouseEnter={() => setHoveredItem(item._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="imageHolder">
              <img src={item.images[0]} alt={item.title} loading="lazy" />
              <div
                className={`overlay ${hoveredItem === item._id ? "show" : ""}`}
              >
                <button
                  className="bookNowButton"
                  onClick={() => handleBookNow(item)}
                >
                  Book Now
                </button>
              </div>
            </div>
            <div className="itemText">
              <p className="categoryText">Category: {item.categories[0]}</p>
              <h4>
                <Link to={`/trip-view?id=${item._id}`}>{item.title}</Link>
              </h4>
              <p>{item.price} USD</p>
              <p>
                Rating:
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl ${
                      index < item.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="button_holder">
        <Link to="/trips">
          <button>VIEW ALL TRIPS</button>
        </Link>
      </div>
    </div>
  );
};

export default PopularTrips;
