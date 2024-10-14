import SideMenu from "../components/SideMenu";
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import '../styles/Dashboard.css';

const AdminTrips = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['ma_auth_token']);
  const ma_auth_token = cookies.ma_auth_token;

  

  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: { continent: '', country: '', locale: null },
    duration: { number: '', period: '' },
    inclusives: [],
    exclusives: [],
    images: [],
    dates: [],
    description: '',
    catch_phrase: '',
    itinerary: [],
    categories: [],
    blog_contents: [],
    activities: [],
    price: 0,
    rating: 1,
  });

  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');

//   const serverUrl = 'http://localhost:5010';
  const serverUrl=process.env.REACT_APP_SERVER_URL

  const fetchTrips = async () => {
    try {
      const resp = await fetch(`${serverUrl}/api/v1/trips`);
      const res = await resp.json();
      if (res.status === 'success') {
        console.log(res.trips)
        setTrips(res.trips);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await fetch(`${serverUrl}/api/v1/categories`);
      const res = await resp.json();
      if (res.status === 'success') {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleTabSwitch = (tab) => setActiveTab(tab);

  const handleDeleteTrips = async (id) => {
    console.log(id)
 
    try {
        const response = await fetch(`${serverUrl}/api/v1/trips/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ma_auth_token}`,
            }
          });
          const res = await response.json();
          console.log(res)
      fetchTrips(); // Reload trips after deleting
    } catch (err) {
      setError('Error deleting trip');
      console.error(err);
    }
    
  };

  const handleAddTrip = async () => {
    const formattedDates = newTrip.dates.map((date) =>
      new Date(date).toISOString()
    );

    const tripData = { ...newTrip, dates: formattedDates };
    console.log(tripData)
    // return

    try {
      const response = await fetch(`${serverUrl}/api/v1/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ma_auth_token}`,
        },
        body: JSON.stringify(tripData),
      });
      const res = await response.json();
      console.log(res)
      if (res.status === 'success') {
        setNewTrip({
          title: '',
          destination: { continent: '', country: '', locale: '' },
          duration: { number: '', period: '' },
          inclusives: [],
          exclusives: [],
          images: [],
          dates: [],
          description: '',
          catch_phrase: '',
          itinerary: [],
          categories: [],
          blog_contents: [],
          activities: [],
          price: '',
          rating: 1,
        });
        fetchTrips(); // Reload trips after adding
      }
    } catch (err) {
      setError('Error adding trip');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((prevState) => ({
      ...prevState,
      [name]: ((name=='rating' ||name=='price'?parseInt(value):value)),
    }));
  };

  const handleArrayInputChange = (name, index, value) => {
    const updatedArray = [...newTrip[name]];
    updatedArray[index] = value;
    setNewTrip({ ...newTrip, [name]: updatedArray });
  };

  const addToArrayField = (name) => {
    setNewTrip({ ...newTrip, [name]: [...newTrip[name], ''] });
  };

  const handleCategoryChange = (selectedCategory) => {
    setNewTrip((prevState) => ({
      ...prevState,
      categories: prevState.categories.includes(selectedCategory)
        ? prevState.categories.filter((cat) => cat !== selectedCategory)
        : [...prevState.categories, selectedCategory],
    }));
  };

  const handleAddCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewTrip((prevState) => ({
        ...prevState,
        categories: [...prevState.categories, newCategory],
      }));
      setNewCategory('');
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchCategories();
  }, []);

  return (
    <div className="home-page">
      <SideMenu activeLink="trips" admin={true} />
      <div className="content">
        <div className="trips-admin">
          <h2>Admin Panel - Trips</h2>
          <div className="tabs">
            <button onClick={() => handleTabSwitch('all')}>All Trips</button>
            <button onClick={() => handleTabSwitch('add')}>Add Trip</button>
          </div>

          {activeTab === 'all' && (
            <div className="all-trips">
              <h3>All Trips</h3>
              {error && <p className="error">{error}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip._id}>
                      <td>{trip.title}</td>
                      <td>{trip.price}</td>
                      <td>
                        {trip.dates.length > 0
                          ? new Date(trip.dates[0]).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/edit-trip?id=${trip._id}`)
                          }
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTrips(trip._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="add-trip">
              <h3>Add a New Trip</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTrip();
                }}
                className="trip-form"
              >
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTrip.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Destination</label>
                  <input
                    type="text"
                    name="destination.continent"
                    placeholder="Continent"
                    value={newTrip.destination.continent}
                    onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        destination: {
                          ...newTrip.destination,
                          continent: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    name="destination.country"
                    placeholder="Country"
                    value={newTrip.destination.country}
                    onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        destination: {
                          ...newTrip.destination,
                          country: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    name="destination.locale"
                    placeholder="Locale"
                    value={newTrip.destination.locale}
                    onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        destination: {
                          ...newTrip.destination,
                          locale: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={newTrip.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Catch Phrase</label>
                    <textarea
                        name="catch_phrase"
                        value={newTrip.catch_phrase}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Duration</label>
                    <div className="duration_box">
                        <span>
                            <small>Number</small>
                            <input type='number'
                                onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        duration: {
                          ...newTrip.duration,
                          number: e.target.value,
                        },
                      })
                    }
                            />
                        </span>
                        
                        <select onChange={(e)=>{
                            setNewTrip({
                                ...newTrip, 
                                duration: {
                          ...newTrip.duration,
                          period: e.target.value,
                        },
                            })
                        }} >
                            <option selected value='days'>Days</option>
                            <option value='weeks'>Weeks</option>
                        </select>
                    </div>
                </div>

                <div>
                  <label>Itineraries</label>
                  {newTrip.itinerary.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('itinerary', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('itinerary')}
                  >
                    Add Itinerary
                  </button>
                </div>

                <div>
                  <label>Images</label>
                  {newTrip.images.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('images', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('images')}
                  >
                    Add Image
                  </button>
                </div>

                <div>
                  <label>Inclusives</label>
                  {newTrip.inclusives.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('inclusives', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('inclusives')}
                  >
                    Add Inclusive
                  </button>
                </div>

                <div>
                  <label>Exclusives</label>
                  {newTrip.exclusives.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('exclusives', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('exclusives')}
                  >
                    Add Exclusive
                  </button>
                </div>

                <div>
                  <label>Categories</label>
                  {newTrip.categories.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('categories', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('categories')}
                  >
                    Add Categories
                  </button>
                </div>

                <div>
                  <label>Blogs</label>
                  {newTrip.blog_contents.map((img, index) => (
                    <input
                      key={index}
                      type="text"
                      value={img}
                      onChange={(e) =>
                        handleArrayInputChange('blog_contents', index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addToArrayField('blog_contents')}
                  >
                    Add Blogs
                  </button>
                </div>

                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    name="dates"
                    value={
                      newTrip.dates.length > 0
                        ? new Date(newTrip.dates[0])
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        dates: [new Date(e.target.value).toISOString()],
                      })
                    }
                  />
                </div>

                {/* <div>
                  <label>Categories</label>
                  {categories.map((cat, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={cat}
                        checked={newTrip.categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                  <input
                    type="text"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button type="button" onClick={handleAddCategory}>
                    Add Category
                  </button>
                </div> */}

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newTrip.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={newTrip.rating}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <button type="submit">Add Trip</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTrips;
