import React, { useState, useEffect } from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import '../styles/TripPage.css'
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import NewHeader from "../components/NewHeader"

const TripPage = ({ tripId }) => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')

  const handleBookNow = (item) => {
    navigate(`/booking?id=${item._id}`);
  };

  const Button = styled.button`
  background-color: #F6A214;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  margin-right: 10px;
`;
  console.log(id)

  // let serverUrl='https://server.mwakaziadventures.com'
  // const serverUrl = 'http://localhost:5010';
  const serverUrl=process.env.REACT_APP_SERVER_URL
  console.log(serverUrl)
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/v1/trips/${id}`);
       
        const data = await response.json();
        console.log(data)
        if(data._id){
          setTripData(data);
          setLoading(false);
        }else{
          setError(data.message);
          setLoading(false);
        }
        // if (!response.ok) {
        //   throw new Error('Failed to fetch trip data');
        // }
        
        // 
        // 
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading trip details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!tripData) {
    return <div className="not-found">Trip not found</div>;
  }

  return (
    <div>
    <NewHeader/>
    <Navbar/>
    <div className="trip-details-container">
      <h1 className="trip-title">{tripData.title}</h1>
      
      <div className="image-gallery">
        {tripData.images.map((img, index) => (
          <img key={index} src={img} alt={`${tripData.title} - Image ${index + 1}`} className="trip-image" />
        ))}
      </div>

      <div className="quick-info">
        <p className="catch-phrase">{tripData.catch_phrase}</p>
        <div className="info-item">
          <span className="icon">📅</span>
          <span>{formatDate(tripData.dates[0])}</span>
        </div>
        <div className="info-item">
          <span className="icon">📍</span>
          <span>{tripData.destination}</span>
        </div>
        <div className="info-item">
          <span className="icon">⭐</span>
          <span>{tripData.rating} / 5</span>
        </div>
        <div className="info-item">
          <span className="icon">💰</span>
          <span>${tripData.price.toFixed(2)}</span>
        </div>
        <div className="info-item">
          <span className="icon">⏱</span>
          <span>{tripData.duration.number} {tripData.duration.period}</span>
        </div>
      </div>

      <section className="trip-section">
        <h2>Description</h2>
        <p>{tripData.description}</p>
      </section>

      <section className="trip-section">
        <h2>Itinerary</h2>
        <ul className="itinerary-list">
          {/* {tripData.itinerary.map((item, index) => (
            <li key={index}>
              <strong>{item.title}</strong>
              <ul>
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </li>
          ))} */}
        </ul>
      </section>

      <section className="trip-section">
        <h2>Categories</h2>
        <div className="categories-list">
          {/* {tripData.categories.map((category, index) => (
            <span key={index} className="category-badge">{category}</span>
          ))} */}
        </div>
      </section>

      <div className="info-cards">
        <div className="info-card">
          <h3>Inclusives</h3>
          <ul>
            {tripData.inclusives.length > 0 ? (
              tripData.inclusives.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>Information not available</li>
            )}
          </ul>
        </div>

        {/* <div className="info-card"> */}
          {/* <h3>Exclusions</h3> */}
          {/* <ul>
            {tripData.exclusives.length > 0 ? (
              tripData.exclusives.map((item, index) => <li key={index}>{item})
            ) : (
              <li>Information not available</li>
            )}
          </ul> */}
        {/* </div> */}

        <div className="info-card">
          <h3>Activities</h3>
          <ul>
            {/* {tripData.activities.map((activity, index) => (
              <li key={index}> {activity.name}</li>
            ))} */}
          </ul>
        </div>
      </div>

      <Button onClick={() => handleBookNow(tripData)}>Book Now</Button>
    </div>
    </div>
  );
};

export default TripPage;
