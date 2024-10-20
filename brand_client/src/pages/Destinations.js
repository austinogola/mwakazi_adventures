import Navbar from "../components/Navbar";
import ResponsiveFooter from "../components/ResponsiveFooter";
import NewHeader from "../components/NewHeader";
import { useEffect, useState } from "react";
import "../styles/Destination.css";

const Destinations = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [locales, setLocales] = useState([]);
  const [continents, setContinents] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [filters, setFilters] = useState({
    country: "",
    locale: "",
    continent: "",
    popular: false,
    dateRange: {
      from: "",
      to: "",
    },
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, filters]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/v1/trips/tripsFilter`);
      const data = await response.json();
      if (data.status === "success") {
        setTrips(data.trips);
        console.log(data.trips);
        extractFilterOptions(data.trips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const extractFilterOptions = (tripsData) => {
    const uniqueCountries = [
      ...new Set(tripsData.map((trip) => trip.destination.country)),
    ];
    const uniqueLocales = [
      ...new Set(tripsData.map((trip) => trip.destination.locale)),
    ];
    const uniqueContinents = [
      ...new Set(tripsData.map((trip) => trip.destination.continent)),
    ];

    setCountries(uniqueCountries);
    setLocales(uniqueLocales);
    setContinents(uniqueContinents);
  };

  const applyFilters = () => {
    let filtered = [...trips];

    if (filters.country) {
      filtered = filtered.filter(
        (trip) => trip.destination.country === filters.country
      );
    }
    if (filters.locale) {
      filtered = filtered.filter(
        (trip) => trip.destination.locale === filters.locale
      );
    }
    if (filters.continent) {
      filtered = filtered.filter(
        (trip) => trip.destination.continent === filters.continent
      );
    }
    if (filters.popular) {
      filtered = filtered.sort((a, b) => b.rating - a.rating).slice(0, 10);
    }
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((trip) => {
        return trip.dates.some((date) => {
          const tripDate = new Date(date);
          return (
            tripDate >= new Date(filters.dateRange.from) &&
            tripDate <= new Date(filters.dateRange.to)
          );
        });
      });
    }

    setFilteredTrips(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const renderTripCard = (trip) => (
    <div key={trip._id} className="tf_tripCard">
      {trip.images && trip.images.length > 0 && (
        <img src={trip.images[0]} alt={trip.title} className="tf_tripImage" />
      )}
      <h3 className="tf_tripTitle">{trip.title}</h3>
      <p className="tf_tripDestination">
        {trip.destination.locale && trip.destination.country
          ? `${trip.destination.locale}, ${trip.destination.country}`
          : trip.destination.country
          ? `${trip.destination.country}, ${trip.destination.continent}`
          : trip.destination.locale
          ? `${trip.destination.locale}, ${trip.destination.continent}`
          : trip.destination.continent}
      </p>
      <p className="tf_tripDuration">{`${trip.duration.number} ${trip.duration.period}`}</p>
      <p className="tf_tripPrice">${trip.price}</p>
      <div className="tf_tripRating">
        <span className="tf_ratingIcon">★</span>
        <span>{trip.rating.toFixed(1)}</span>
      </div>
    </div>
  );

  return (
    <div>
      <NewHeader />
      <Navbar />
      <div className="tf_container">
        <h1 className="tf_heading">Search for trip</h1>
        <div className="tf_filterOptions">
          <select
            className="tf_select"
            onChange={(e) => handleFilterChange("country", e.target.value)}
            value={filters.country}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            className="tf_select"
            onChange={(e) => handleFilterChange("locale", e.target.value)}
            value={filters.locale}
          >
            <option value="">All Locales</option>
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {locale}
              </option>
            ))}
          </select>

          <select
            className="tf_select"
            onChange={(e) => handleFilterChange("continent", e.target.value)}
            value={filters.continent}
          >
            <option value="">All Continents</option>
            {continents.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>

          <select
            className="tf_select"
            onChange={(e) =>
              handleFilterChange("popular", e.target.value === "true")
            }
            value={filters.popular.toString()}
          >
            <option value="false">All Trips</option>
            <option value="true">Popular Trips</option>
          </select>
        </div>

        <div className="tf_dateRangePicker">
          <input
            type="date"
            className="tf_dateInput"
            value={filters.dateRange.from}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                from: e.target.value,
              })
            }
          />
          <span className="tf_dateRangeSeparator">to</span>
          <input
            type="date"
            className="tf_dateInput"
            value={filters.dateRange.to}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                to: e.target.value,
              })
            }
          />
        </div>

        <div className="tf_tripList">{filteredTrips.map(renderTripCard)}</div>
      </div>
      <ResponsiveFooter />
    </div>
  );
};

export default Destinations;
