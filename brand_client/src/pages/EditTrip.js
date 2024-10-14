
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate ,useSearchParams} from 'react-router-dom'; // Assuming you're using React Router for navigation
import '../styles/EditTrip.css'; // Import styles
import '../styles/Dashboard.css'
import SideMenu from '../components/SideMenu';

const EditTrip = () => {

  const navigate = useNavigate(); // For navigation after successful edit
  const [trip, setTrip] = useState(null); // Store trip details
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('id')
//   const serverUrl='http://localhost:5010'
//   const serverUrl='https://server.mwakaziadventures.com'
const serverUrl=process.env.REACT_APP_SERVER_URL
console.log(serverUrl)

  useEffect(() => {
    fetchTripDetails(tripId);
  }, [tripId]);

  // Fetch trip details from API
  const fetchTripDetails = async (id) => {
    try {
        fetch(`${serverUrl}/api/v1/trips/${id}`,{
            method:'GET',

        }).then(async resp=>{
            const res=await resp.json()
            console.log(res)
            setTrip(res);
            setIsLoading(false);
        })
      
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Failed to load trip details.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrip((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (name, index, value) => {
    const updatedArray = [...trip[name]];
    updatedArray[index] = value;
    setTrip({ ...trip, [name]: updatedArray });
  };

  const addToArrayField = (name) => {
    setTrip({ ...trip, [name]: [...trip[name], ''] });
  };

  const handleUpdateTrip = async () => {
    console.log(trip)
    return
    try {
      await axios.put(`/api/trips/${tripId}`, trip);
      navigate('/admin/trips'); // Redirect after successful update
    } catch (err) {
      setError('Error updating trip');
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-page">
            <SideMenu activeLink='trips' admin={true}/>
            <div className="content">

            <div className="edit-trip">
                <h2>Edit Trip</h2>
                {trip && (
                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateTrip();
                    }}
                    className="trip-form"
                    >
                    <div>
                        <label>Title</label>
                        <input
                        type="text"
                        name="title"
                        value={trip.title}
                        onChange={handleInputChange}
                        required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={trip.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Destination</label>
                        <input
                        type="text"
                        name="destination"
                        value={trip.destination}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Duration</label>
                        <input
                        type="number"
                        name="duration.number"
                        placeholder="Number"
                        value={trip.duration.number}
                        onChange={(e) =>
                            setTrip({
                            ...trip,
                            duration: { ...trip.duration, number: e.target.value },
                            })
                        }
                        required
                        />
                        <input
                        type="text"
                        name="duration.period"
                        placeholder="Period (e.g., days, weeks)"
                        value={trip.duration.period}
                        onChange={(e) =>
                            setTrip({
                            ...trip,
                            duration: { ...trip.duration, period: e.target.value },
                            })
                        }
                        required
                        />
                    </div>
                    <div>
                        <label>Inclusives</label>
                        {trip.inclusives.map((inc, index) => (
                        <input
                            key={index}
                            type="text"
                            value={inc}
                            onChange={(e) => handleArrayInputChange('inclusives', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('inclusives')}>
                        Add Inclusive
                        </button>
                    </div>
                    <div>
                        <label>Exclusives</label>
                        {trip.exclusives.map((exc, index) => (
                        <input
                            key={index}
                            type="text"
                            value={exc}
                            onChange={(e) => handleArrayInputChange('exclusives', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('exclusives')}>
                        Add Exclusive
                        </button>
                    </div>
                    
                    <div>
                        <label>Images</label>
                        {trip.images.map((inc, index) => (
                        <input
                            key={index}
                            type="text"
                            value={inc}
                            onChange={(e) => handleArrayInputChange('images', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('images')}>
                        Add Image
                        </button>
                    </div>
                    <div>
                        <label>Dates</label>
                        <input
                        type="date"
                        name="dates"
                        value={trip.dates}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                        name="description"
                        value={trip.description}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Catch Phrase</label>
                        <input
                        type="text"
                        name="catch_phrase"
                        value={trip.catch_phrase}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Itinerary</label>
                        {trip.itinerary.map((item, index) => (
                        <input
                            key={index}
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayInputChange('itinerary', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('itinerary')}>
                        Add Itinerary Item
                        </button>
                    </div>
                    <div>
                        <label>Blogs</label>
                        {trip.blog_contents.map((exc, index) => (
                        <input
                            key={index}
                            type="text"
                            value={exc}
                            onChange={(e) => handleArrayInputChange('blog_contents', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('blog_contents')}>
                        Add Blog
                        </button>
                    </div>
                    <div>
                        <label>Categories</label>
                        {trip.categories.map((exc, index) => (
                        <input
                            key={index}
                            type="text"
                            value={exc}
                            onChange={(e) => handleArrayInputChange('categories', index, e.target.value)}
                        />
                        ))}
                        <button type="button" onClick={() => addToArrayField('categories')}>
                        Add Categrory
                        </button>
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                        type="number"
                        name="price"
                        value={trip.price}
                        onChange={handleInputChange}
                        required
                        />
                    </div>
                    <div>
                        <label>Rating</label>
                        <input
                        type="number"
                        name="rating"
                        value={trip.rating}
                        onChange={handleInputChange}
                        min={1}
                        max={5}
                        />
                    </div>
                    <div>
                        <button type="submit">Update Trip</button>
                    </div>
                    </form>
                )}
                </div>
            </div>
    </div>
    
  );
};

export default EditTrip;
