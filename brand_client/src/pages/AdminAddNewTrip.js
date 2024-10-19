import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AddNewTrip = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [cookies] = useCookies(["ma_auth_token"]);
  const ma_auth_token = cookies.ma_auth_token;
  const [error, setError] = useState(null);
  const [newTrip, setNewTrip] = useState({
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
    dates: [], // Keep dates as an array
    description: "",
    catch_phrase: "",
    itinerary: [{ title: "", points: [] }],
    categories: [],
    blog_contents: [],
    activities: [],
    price: 0,
    rating: 1,
  });
  const navigate = useNavigate();

  const handleAddTrip = async () => {
    const formattedDates = newTrip.dates.map((date) =>
      new Date(date).toISOString()
    );
    const tripData = { ...newTrip, dates: formattedDates };

    try {
      const response = await fetch(`${serverUrl}/api/v1/trips/addNewTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ma_auth_token}`,
        },
        body: JSON.stringify(tripData),
      });
      const data = await response.json();
      if (data.status === "success") {
        resetTripForm();
        navigate("/admin");
      } else {
        setError(data.message || "Error adding trip");
      }
    } catch (err) {
      setError("Error adding trip");
      console.error(err);
    }
  };

  const resetTripForm = () => {
    setNewTrip({
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
      dates: [], // Reset dates
      description: "",
      catch_phrase: "",
      itinerary: [{ title: "", points: [] }],
      categories: [],
      blog_contents: [],
      activities: [],
      price: 0,
      rating: 1,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    if (nameParts.length === 2) {
      setNewTrip((prevState) => ({
        ...prevState,
        [nameParts[0]]: {
          ...prevState[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setNewTrip((prevState) => ({
        ...prevState,
        [name]: name === "rating" || name === "price" ? parseInt(value) : value,
      }));
    }
  };

  const handleArrayInputChange = (name, index, value) => {
    setNewTrip((prevState) => {
      const updatedArray = [...prevState[name]];
      updatedArray[index] = value;
      return { ...prevState, [name]: updatedArray };
    });
  };

  const addToArrayField = (name) => {
    setNewTrip((prevState) => ({
      ...prevState,
      [name]: [...prevState[name], ""],
    }));
  };

  const addPlaceVisited = () => {
    setNewTrip((prevState) => ({
      ...prevState,
      places_visited: [
        ...prevState.places_visited,
        { continent: "", country: "", locale: "" },
      ],
    }));
  };

  const handlePlaceVisitedChange = (index, field, value) => {
    setNewTrip((prevState) => {
      const updatedPlacesVisited = [...prevState.places_visited];
      updatedPlacesVisited[index] = {
        ...updatedPlacesVisited[index],
        [field]: value,
      };
      return { ...prevState, places_visited: updatedPlacesVisited };
    });
  };

  const addItineraryItem = () => {
    setNewTrip((prevState) => ({
      ...prevState,
      itinerary: [...prevState.itinerary, { title: "", points: [""] }],
    }));
  };

  const addPointToItinerary = (index) => {
    setNewTrip((prevState) => {
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
    setNewTrip((prevState) => {
      const updatedItinerary = [...prevState.itinerary];
      updatedItinerary[index].title = value;
      return { ...prevState, itinerary: updatedItinerary };
    });
  };

  const handlePointsChange = (index, pointIndex, value) => {
    setNewTrip((prevState) => {
      const updatedItinerary = [...prevState.itinerary];
      updatedItinerary[index].points[pointIndex] = value;
      return { ...prevState, itinerary: updatedItinerary };
    });
  };

  const renderItineraryInputs = () => (
    <div>
      <label>Itinerary</label>
      {newTrip.itinerary.map((item, index) => (
        <div key={index} className="itinerary-item">
          <input
            type="text"
            placeholder="Title"
            value={item.title}
            onChange={(e) => handleTitleChange(index, e.target.value)}
            required
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
              required
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

  const renderArrayInputs = (label, name) => (
    <div>
      <label>{label}</label>
      {newTrip[name].map((item, index) => (
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
      {newTrip.places_visited.map((place, index) => (
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
        value={newTrip.destination.continent}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="destination.country"
        placeholder="Country"
        value={newTrip.destination.country}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="destination.locale"
        placeholder="Locale"
        value={newTrip.destination.locale}
        onChange={handleInputChange}
        required
      />
    </div>
  );

  const renderDateInputs = () => (
    <div>
      <label>Dates</label>
      {newTrip.dates.map((date, index) => (
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

  return (
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
        {renderDestinationInputs()}
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
            <input
              type="number"
              name="duration.number"
              value={newTrip.duration.number}
              onChange={handleInputChange}
            />
            <select
              name="duration.period"
              value={newTrip.duration.period}
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
        {renderDateInputs()} {/* Changed to use the date input */}
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
            value={newTrip.price}
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
            value={newTrip.rating}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Trip</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddNewTrip;
