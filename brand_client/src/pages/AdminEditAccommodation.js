import { useNavigate } from "react-router-dom";
import "../styles/AdminEditAccommodation.css";
import React, { useEffect, useState } from "react";

function AdminEditAccommodation({ id, onClose }) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const [formData, setFormData] = useState({
    description: "",
    location: "",
    amenities: [""],
    negotiable: false,
    dailyRate: "",
    images: [""],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/v1/accommodations/${id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id, serverUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = value;
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const addAmenityField = () => {
    setFormData({ ...formData, amenities: [...formData.amenities, ""] });
  };

  const removeAmenityField = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setError(null);
    try {
      const response = await fetch(`${serverUrl}/api/v1/accommodations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Accommodation updated successfully!");
        onClose(); // Close the modal on success
        navigate("/admin/accommodations");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Please try again.");
      }
    } catch (error) {
      setError(
        `An unexpected error occurred: ${error.message}. Please check your connection and try again.`
      );
      console.error("Accommodation update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="accommodation-edit-form-wrapper">
      <h2 className="accommodation-form-header">Edit Accommodation</h2>
      <form className="accommodation-form" onSubmit={handleSubmit}>
        <label className="accommodation-form-label">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="accommodation-form-input"
          required
        />

        <label className="accommodation-form-label">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="accommodation-form-input"
          required
        />

        <label className="accommodation-form-label">Amenities:</label>
        {formData.amenities.map((amenity, index) => (
          <div key={index} className="amenity-input-wrapper">
            <input
              type="text"
              name={`amenity-${index}`}
              value={amenity}
              onChange={(e) => handleAmenityChange(index, e.target.value)}
              className="accommodation-form-input"
              placeholder={`Amenity ${index + 1}`}
            />
            {index > 0 && (
              <button
                type="button"
                className="remove-amenity-button"
                onClick={() => removeAmenityField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="add-amenity-button"
          onClick={addAmenityField}
        >
          Add Amenity
        </button>

        <label className="accommodation-form-label">Negotiable:</label>
        <input
          type="checkbox"
          name="negotiable"
          checked={formData.negotiable}
          onChange={handleChange}
          className="accommodation-form-negotiate-input"
        />

        <label className="accommodation-form-label">Daily Rate:</label>
        <input
          type="number"
          name="dailyRate"
          value={formData.dailyRate}
          onChange={handleChange}
          className="accommodation-form-input"
          required
        />

        <label className="accommodation-form-label">Images:</label>
        {formData.images.map((image, index) => (
          <div key={index} className="image-input-wrapper">
            <input
              type="text"
              name={`image-${index}`}
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="accommodation-form-input"
              placeholder={`Image URL ${index + 1}`}
            />
            {index > 0 && (
              <button
                type="button"
                className="remove-image-button"
                onClick={() => removeImageField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="add-image-button"
          onClick={addImageField}
        >
          Add Image
        </button>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Accommodation"}
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default AdminEditAccommodation;
