import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import "../styles/AdminAccommodations.css";
import AdminAllAccommodations from "./AdminAllAccommodations";

function AdminAccommodations() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    amenities: [""],
    negotiable: false,
    dailyRate: "",
    images: [""],
  });

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

    try {
      const response = await fetch(
        `${serverUrl}/api/v1/accommodations/create-accommodation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      if (response.ok) {
        alert(
          "Accommodation created successfully! You can now view it or add another accommodation."
        );
        setFormData({
          description: "",
          location: "",
          amenities: [""],
          negotiable: false,
          dailyRate: "",
          images: [""],
        });
      } else {
        const errorData = await response.json();
        alert(
          `Error creating accommodation: ${
            errorData.message || "Please try again."
          }`
        );
      }
    } catch (error) {
      alert(
        `An unexpected error occurred: ${error.message}. Please check your connection and try again.`
      );
      console.error("Accommodation creation error:", error);
    }
  };

  return (
    <div className="accommodations-parentDiv">
      <SideMenu activeLink="accommodations" admin={true} />
      <div className="accommodation-manager">
        <div className="top-menu">
          <button
            className={`menu-button ${!showAddForm ? "active" : ""}`}
            onClick={() => setShowAddForm(false)}
          >
            View All Accommodations
          </button>
          <button
            className={`menu-button ${showAddForm ? "active" : ""}`}
            onClick={() => setShowAddForm(true)}
          >
            Add Accommodation
          </button>
        </div>

        {showAddForm ? (
          <div className="accommodation-form-wrapper">
            <h2 className="accommodation-form-header">Create Accommodation</h2>
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

              <label className="accommodation-form-label">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="accommodation-form-checkbox"
                />
                Negotiable
              </label>

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

              <button type="submit" className="accommodation-form-button">
                Create Accommodation
              </button>
            </form>
          </div>
        ) : (
          <AdminAllAccommodations />
        )}
      </div>
    </div>
  );
}

export default AdminAccommodations;
