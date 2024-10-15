import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoImg from "../images/Mwakazi-Adventures-Logo-Cropped.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const displayPages = function () {
    setIsActive(!isActive);
  };

  const destinations = {
    "United States": ["New York", "Los Angeles", "Chicago", "Miami"],
    France: ["Paris", "Nice", "Lyon", "Marseille"],
    Japan: ["Tokyo", "Kyoto", "Osaka", "Hokkaido"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={LogoImg} alt="Company Logo" />
        </div>
        <button className="navbar-hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-links ${isMenuOpen ? "mobile" : ""}`}>
          <li className="navbar-link">
            <Link to="/">Home</Link>
          </li>
          <li
            className="navbar-link"
            onMouseEnter={() => handleMouseEnter("destinations")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/destinations">Destinations</Link>
          </li>
          <li className="navbar-link">
            <Link to="/trips">Trips</Link>
          </li>
          <li className="navbar-link">
            <Link to="/activities">Activities</Link>
          </li>
          <li className="navbar-link">
            <Link to="/accommodations">Accommodations</Link>
          </li>
          <li className="navbar-link pagesDropdown">
            <div onClick={displayPages}>
              <p>Pages</p>
            </div>
          </li>
          <li className={`navbar-links ${isActive ? "active" : "notActive"}`}>
            <Link to="/about">
              <p className="pagesLink">About</p>
            </Link>
          </li>
          <li className={`navbar-links ${isActive ? "active" : "notActive"}`}>
            <Link to="/blogs">
              <p className="pagesLink">Blog</p>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
