import React, { useEffect, useState } from "react";
import "../styles/AdminAllAccommodations.css";
import AdminEditAccommodation from "./AdminEditAccommodation";

function AdminAllAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [id, setId] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/v1/accommodations`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setAccommodations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [showOverlay, showEditModal]);

  const handleEditAccommodation = function (id) {
    setShowEditModal(true);
    setId(id);
    setShowOverlay(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setShowOverlay(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      setAccommodations(accommodations.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <div className="accommodation-list">
        <h2 className="accommodation-form-header">Available Accommodations</h2>
        <ul>
          {accommodations.map((accommodation, index) => (
            <li key={index} className="accommodation-item">
              <h3>{accommodation.location}</h3>
              <p>{accommodation.description}</p>
              <p>Daily Rate: ${accommodation.dailyRate}</p>
              <button
                className="edit-button"
                onClick={() => handleEditAccommodation(accommodation._id)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {showEditModal && (
          <AdminEditAccommodation id={id} onClose={closeEditModal} />
        )}
        {showOverlay && (
          <div className="overLayDiv" onClick={closeEditModal}></div>
        )}
      </div>
    </div>
  );
}

export default AdminAllAccommodations;
