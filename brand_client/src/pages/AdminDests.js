import SideMenu from "../components/SideMenu";
import "../styles/AdminDestinations.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDests = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [formData, setFormData] = useState({
    country: "",
    continent: "",
    locale: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/trips/addDestination`,
        formData
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the destination."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/v1/trips/destinations`
        );
        setDestinations(response.data);
      } catch (err) {
        setFetchError("Error fetching destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [serverUrl]);

  if (loading) return <p>Loading destinations...</p>;
  if (fetchError) return <p className="error">{fetchError}</p>;

  return (
    <div className="add_destination_parent_div">
      <SideMenu activeLink="destinations" admin={true} />
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1.8fr",
          marginTop: "2rem",
          // alignItems: "center",
        }}
      >
        <div className="add-destination-container">
          <h2>Add a New Destination</h2>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <form className="add-destination-form" onSubmit={handleSubmit}>
            <div>
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Continent:</label>
              <input
                type="text"
                name="continent"
                value={formData.continent}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Locale:</label>
              <input
                type="text"
                name="locale"
                value={formData.locale}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Destination"}
            </button>
          </form>
        </div>
        <div className="destinations-list-container">
          <div className="destinations-content">
            <h2>All Destinations</h2>
            <ul>
              {destinations.map((dest) => (
                <li key={dest._id}>
                  <h3>{dest.country}</h3>
                  <p>
                    {dest.continent} - {dest.locale}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDests;
