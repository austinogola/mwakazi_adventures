import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/EditTrip.css";
import "../styles/Dashboard.css";
import SideMenu from "../components/SideMenu";

const EditTrip = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    title: "",
    destination: { continent: "", country: "", locale: "" },
    duration: { number: "", period: "" },
    inclusives: [],
    exclusives: [],
    images: [],
    dates: "",
    description: "",
    catch_phrase: "",
    itinerary: [],
    categories: [],
    blog_contents: [],
    activities: [],
    price: 0,
    rating: 1,
    highlights: [],
    places_visited: [{ continent: "", country: "", locale: "" }],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId]);

  const fetchTripDetails = async (id) => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/trips/${id}`);
      setTrip(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching trip:", err);
      setError("Failed to load trip details.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setTrip((prevState) => ({
        ...prevState,
        [parent]: { ...prevState[parent], [child]: value },
      }));
    } else {
      setTrip((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleArrayInputChange = (name, index, value) => {
    setTrip((prevState) => {
      const updatedArray = [...prevState[name]];
      updatedArray[index] = value;
      return { ...prevState, [name]: updatedArray };
    });
  };

  const addToArrayField = (name) => {
    setTrip((prevState) => ({
      ...prevState,
      [name]: [...prevState[name], ""],
    }));
  };

  const handleUpdateTrip = async () => {
    try {
      console.log("Sending trip data:", trip);
      const response = await axios.put(
        `${serverUrl}/api/v1/trips/${tripId}`,
        trip
      );
      if (response.status === 200) {
        navigate("/admin/trips");
      } else {
        setError("Failed to update trip. Please try again.");
      }
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Error updating trip. Please check your inputs and try again.");
    }
  };

  const handlePlaceVisitedChange = (index, field, value) => {
    setTrip((prevState) => {
      const updatedPlacesVisited = [...prevState.places_visited];
      updatedPlacesVisited[index] = {
        ...updatedPlacesVisited[index],
        [field]: value,
      };
      return { ...prevState, places_visited: updatedPlacesVisited };
    });
  };

  const addPlaceVisited = () => {
    setTrip((prevState) => ({
      ...prevState,
      places_visited: [
        ...prevState.places_visited,
        { continent: "", country: "", locale: "" },
      ],
    }));
  };

  const renderPlacesVisitedInputs = () => (
    <div>
      {trip.places_visited.map((place, index) => (
        <div key={index} className="places-visited-inputs">
          <input
            type="text"
            placeholder="Continent"
            value={place.continent}
            onChange={(e) =>
              handlePlaceVisitedChange(index, "continent", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Country"
            value={place.country}
            onChange={(e) =>
              handlePlaceVisitedChange(index, "country", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Locale"
            value={place.locale}
            onChange={(e) =>
              handlePlaceVisitedChange(index, "locale", e.target.value)
            }
          />
        </div>
      ))}
      <button type="button" onClick={addPlaceVisited}>
        Add Place Visited
      </button>
    </div>
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-page">
      <SideMenu activeLink="trips" admin={true} />
      <div className="content">
        <div className="edit-trip">
          <h2>Edit Trip</h2>
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
              <label>Continent</label>
              <input
                type="text"
                name="destination.continent"
                value={trip.destination.continent}
                onChange={handleInputChange}
              />
              <label>Country</label>
              <input
                type="text"
                name="destination.country"
                value={trip.destination.country}
                onChange={handleInputChange}
              />
              <label>Locale</label>
              <input
                type="text"
                name="destination.locale"
                value={trip.destination.locale}
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
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="duration.period"
                placeholder="Period (e.g., days, weeks)"
                value={trip.duration.period}
                onChange={handleInputChange}
                required
              />
            </div>
            {[
              "inclusives",
              "exclusives",
              "images",
              "itinerary",
              "blog_contents",
              "categories",
              "highlights",
            ].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {trip[field].map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayInputChange(field, index, e.target.value)
                    }
                  />
                ))}
                <button type="button" onClick={() => addToArrayField(field)}>
                  Add {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              </div>
            ))}
            {renderPlacesVisitedInputs()}
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
                min="0"
                max="5"
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
