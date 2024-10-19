import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ResponsiveFooter from "../components/ResponsiveFooter";
import Header from "../components/Header";
import NewHeader from "../components/NewHeader";

// Styled components (unchanged)

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
`;

const Content = styled.div`
  padding: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #333;
`;

const Info = styled.div`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const Button = styled.button`
  background-color: #f6a214;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  margin-right: 10px;
`;

const Button2 = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

const Trips = () => {
  const navigate = useNavigate();
  const [tripItems, setTripItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const serverUrl = 'http://localhost:5010';
  // const serverUrl = 'https://server.mwakaziadventures.com';

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  console.log(serverUrl);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v1/trips?size=10`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const response = await res.json();
        console.log(response);
        setTripItems(response.trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const gotToDetails = (item) => {
    navigate(`/trip-view?id=${item._id}`);
  };

  const handleBookNow = (item) => {
    navigate(`/booking?id=${item._id}`);
  };

  function formatDate(dateString, rangeObj = null) {
    const date = new Date(dateString);

    // Format the given date
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "");

    // If no range object is provided, return the formatted date
    if (!rangeObj) {
      return formattedDate;
    }

    // Determine the period to add (days, weeks, months, etc.)
    let endDate = new Date(date);
    const { period, number } = rangeObj;

    switch (period) {
      case "days":
        endDate.setDate(endDate.getDate() + number);
        break;
      case "weeks":
        endDate.setDate(endDate.getDate() + number * 7);
        break;
      case "months":
        endDate.setMonth(endDate.getMonth() + number);
        break;
      case "years":
        endDate.setFullYear(endDate.getFullYear() + number);
        break;
      default:
        throw new Error(
          'Invalid period. Use "days", "weeks", "months", or "years".'
        );
    }

    // Format the end date
    const formattedEndDate = endDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "");

    // Return the date range
    return `${formattedDate} - ${formattedEndDate}`;
  }

  // Example usage:

  if (isLoading) {
    return <LoadingScreen>Loading trips...</LoadingScreen>;
  }

  return (
    <div>
      <NewHeader />
      <Navbar />
      <div style={{ textAlign: "center" }}>
        <h2>Our Trips</h2>
      </div>
      <Container>
        {tripItems.map((trip) => (
          <Card key={trip._id}>
            <Image src={trip.images[0]} alt={trip.title} loading="lazy" />
            <Content>
              <Title>{trip.title}</Title>
              <Info>
                {trip.destination.locale
                  ? `${trip.destination.locale}, ${trip.destination.country}`
                  : trip.destination.country}
              </Info>
              <Info>{formatDate(trip.dates[0], trip.duration)}</Info>
              <Button onClick={() => handleBookNow(trip)}>Book Now</Button>
              <Button2 onClick={() => gotToDetails(trip)}>View Details</Button2>
            </Content>
          </Card>
        ))}
      </Container>
      <ResponsiveFooter />
    </div>
  );
};

export default Trips;
