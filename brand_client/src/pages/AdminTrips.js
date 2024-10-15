import SideMenu from "../components/SideMenu";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../styles/Dashboard.css";
import AddNewTrip from "./AdminAddNewTrip";

const AdminTrips = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["ma_auth_token"]);
  const ma_auth_token = cookies.ma_auth_token;
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  //   const serverUrl = 'http://localhost:5010';
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const fetchTrips = async () => {
    try {
      const resp = await fetch(`${serverUrl}/api/v1/trips`);
      const res = await resp.json();
      if (res.status === "success") {
        console.log(res.trips);
        setTrips(res.trips);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const resp = await fetch(`${serverUrl}/api/v1/categories`);
      const res = await resp.json();
      if (res.status === "success") {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleTabSwitch = (tab) => setActiveTab(tab);

  const handleDeleteTrips = async (id) => {
    console.log(id);

    try {
      const response = await fetch(`${serverUrl}/api/v1/trips/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ma_auth_token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      fetchTrips(); // Reload trips after deleting
    } catch (err) {
      setError("Error deleting trip");
      console.error(err);
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
            <button onClick={() => handleTabSwitch("all")}>All Trips</button>
            <button onClick={() => handleTabSwitch("add")}>Add Trip</button>
          </div>

          {activeTab === "all" && (
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
                          : "N/A"}
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

          {activeTab === "add" && <AddNewTrip />}
        </div>
      </div>
    </div>
  );
};

export default AdminTrips;
