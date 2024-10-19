import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/EditTrip.css";
import "../styles/Dashboard.css";
import SideMenu from "../components/SideMenu";

const EditTrip = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState(null);
  const [trip, setTrip] = useState({
    title: "",
    destination: {
      continent: "",
      country: "",
      locale: "",
    },
    places_visited: [],
    duration: { number: "", period: "days" },
    highlights: [],
    inclusives: [],
    exclusives: [],
    images: [],
    dates: [],
    description: "",
    catch_phrase: "",
    itinerary: [{ title: "", points: [] }],
    categories: [],
    blog_contents: [],
    activities: [],
    price: 0,
    rating: 1,
  });

  useEffect(() => {
    const fetchTripDetails = async (id) => {
      try {
        const response = await axios.get(`${serverUrl}/api/v1/trips/${id}`);
        setTrip(response.data.trip);
        setDestination(response.data.destination);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("Failed to load trip details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails(tripId);
    } else {
      setError("No trip ID provided.");
      setIsLoading(false);
    }
  }, [tripId, serverUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    if (nameParts.length === 2) {
      setTrip((prevState) => ({
        ...prevState,
        [nameParts[0]]: {
          ...prevState[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setTrip((prevState) => ({
        ...prevState,
        [name]: name === "rating" || name === "price" ? parseInt(value) : value,
      }));
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

  const addPlaceVisited = () => {
    setTrip((prevState) => ({
      ...prevState,
      places_visited: [
        ...prevState.places_visited,
        { continent: "", country: "", locale: "" },
      ],
    }));
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

  const addItineraryItem = () => {
    setTrip((prevState) => ({
      ...prevState,
      itinerary: [...prevState.itinerary, { title: "", points: [""] }],
    }));
  };

  const addPointToItinerary = (index) => {
    setTrip((prevState) => {
      const updatedItinerary = prevState.itinerary.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            points: [...item.points, ""],
          };
        }
        return item;
      });
      return { ...prevState, itinerary: updatedItinerary };
    });
  };

  const handleTitleChange = (index, value) => {
    setTrip((prevState) => {
      const updatedItinerary = [...prevState.itinerary];
      updatedItinerary[index].title = value;
      return { ...prevState, itinerary: updatedItinerary };
    });
  };

  const handlePointsChange = (index, pointIndex, value) => {
    setTrip((prevState) => {
      const updatedItinerary = [...prevState.itinerary];
      updatedItinerary[index].points[pointIndex] = value;
      return { ...prevState, itinerary: updatedItinerary };
    });
  };

  const handleUpdateTrip = async () => {
    try {
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

  const renderArrayInputs = (label, name) => (
    <div>
      <label>{label}</label>
      {trip[name].map((item, index) => (
        <input
          key={index}
          type="text"
          value={item}
          onChange={(e) => handleArrayInputChange(name, index, e.target.value)}
        />
      ))}
      <button type="button" onClick={() => addToArrayField(name)}>
        Add {label}
      </button>
    </div>
  );

  const renderPlacesVisitedInputs = () => (
    <div>
      <label>Places Visited</label>
      {trip.places_visited.map((place, index) => (
        <div key={index} className="places-visited-inputs">
          <input
            type="text"
            name={`continent`}
            placeholder="Continent"
            value={place.continent}
            onChange={(e) =>
              handlePlaceVisitedChange(index, "continent", e.target.value)
            }
          />
          <input
            type="text"
            name={`country`}
            placeholder="Country"
            value={place.country}
            onChange={(e) =>
              handlePlaceVisitedChange(index, "country", e.target.value)
            }
          />
          <input
            type="text"
            name={`locale`}
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

  const renderDestinationInputs = () => (
    <div>
      <label>Destination</label>
      <input
        type="text"
        name="destination.continent"
        placeholder="Continent"
        value={destination.continent}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="destination.country"
        placeholder="Country"
        value={destination.country}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="destination.locale"
        placeholder="Locale"
        value={destination.locale}
        onChange={handleInputChange}
        required
      />
    </div>
  );

  const renderDateInputs = () => (
    <div>
      <label>Dates</label>
      {trip.dates.map((date, index) => (
        <input
          key={index}
          type="date"
          value={date}
          onChange={(e) =>
            handleArrayInputChange("dates", index, e.target.value)
          }
        />
      ))}
      <button type="button" onClick={() => addToArrayField("dates")}>
        Add Date
      </button>
    </div>
  );

  const renderItineraryInputs = () => (
    <div>
      <label>Itinerary</label>
      {trip.itinerary.map((item, index) => (
        <div key={index} className="itinerary-item">
          <input
            type="text"
            placeholder="Title"
            value={item.title}
            onChange={(e) => handleTitleChange(index, e.target.value)}
          />
          {item.points.map((point, pointIndex) => (
            <input
              key={pointIndex}
              type="text"
              value={point}
              placeholder="Point"
              onChange={(e) =>
                handlePointsChange(index, pointIndex, e.target.value)
              }
            />
          ))}
          <button type="button" onClick={() => addPointToItinerary(index)}>
            Add Point
          </button>
        </div>
      ))}
      <button type="button" onClick={addItineraryItem}>
        Add Itinerary
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
            {renderDestinationInputs()}
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
              <textarea
                name="catch_phrase"
                value={trip.catch_phrase}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Duration</label>
              <div className="duration_box">
                <input
                  type="number"
                  name="duration.number"
                  value={trip.duration.number}
                  onChange={handleInputChange}
                />
                <select
                  name="duration.period"
                  value={trip.duration.period}
                  onChange={handleInputChange}
                >
                  <option value="days">days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </select>
              </div>
            </div>
            {renderArrayInputs("Highlights", "highlights")}
            {renderArrayInputs("Inclusives", "inclusives")}
            {renderArrayInputs("Exclusives", "exclusives")}
            {renderArrayInputs("Images", "images")}
            {renderDateInputs()}
            {renderArrayInputs("Categories", "categories")}
            {renderArrayInputs("Blog Contents", "blog_contents")}
            {renderArrayInputs("Activities", "activities")}
            {renderItineraryInputs()}
            {renderPlacesVisitedInputs()}
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={trip.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={trip.rating}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Update Trip</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
