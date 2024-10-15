import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import ResponsiveFooter from '../components/ResponsiveFooter';
import NewHeader from "../components/NewHeader"

const Accommodations = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/accommodations`);
        const data = await response.json();
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };

    fetchAccommodations();
  }, []);

  return(
    <div>
    <NewHeader/>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Accommodations</h1>
        {accommodations.map((accommodation, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <img src={accommodation.images[0]} alt="Accommodation" style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
            <p>{accommodation.description}</p>
            <p>Location: {accommodation.location}</p>
            <p>Amenities: {accommodation.amenities.join(', ')}</p>
            <p>Daily Rate: ${accommodation.dailyRate}</p>
            <button 
              style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => navigate(`/booking?id=${accommodation._id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
      <ResponsiveFooter />
    </div>
    )
};

export default Accommodations;
