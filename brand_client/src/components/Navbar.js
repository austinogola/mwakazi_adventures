import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../images/Mwakazi-Adventures-Logo-Cropped.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = (dropdown) => {
    if (windowWidth > 768) {
      setActiveDropdown(dropdown);
    }
  };

  const handleMouseLeave = () => {
    if (windowWidth > 768) {
      setActiveDropdown(null);
    }
  };

  const destinations = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami'],
    'France': ['Paris', 'Nice', 'Lyon', 'Marseille'],
    'Japan': ['Tokyo', 'Kyoto', 'Osaka', 'Hokkaido'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  };

  const navbarStyle = {
    // backgroundColor: '#00B98B',
    backgroundColor: 'white',
    // padding: '0rem',
    color: 'white',
    zIndex: 3,
    position:'sticky',
    top:0,
    padding:'5px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // maxWidth: '1200px',
    margin: '0 auto',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  
  };

  const navLinksStyle = {
    listStyle: 'none',
    display: windowWidth > 768 ? 'flex' : isMenuOpen ? 'flex' : 'none',
    flexDirection: windowWidth > 768 ? 'row' : 'column',
    position: windowWidth > 768 ? 'static' : 'absolute',
    top: windowWidth > 768 ? 'auto' : '60px',
    left: 0,
    right: 0,
    // backgroundColor: '#00B98B',
    padding: windowWidth > 768 ? 0 : '1rem',
    margin: 0,
    transition:'all .3s ease',


  };

  const navLinkStyle = {
    margin: windowWidth > 768 ? '0 1rem' : '0.5rem 0',
    position: 'relative',
  };

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
  };

  const hamburgerStyle = {
    display: windowWidth > 768 ? 'none' : 'block',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
  };

  const dropdownStyle = {
    display: activeDropdown === 'destinations' ? 'block' : 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#00B98B',
    padding: '1rem',
    zIndex: 1000,
    minWidth: '200px',
  };

  const countryStyle = {
    marginBottom: '0.5rem',
    cursor: 'pointer',
    position: 'relative',
  };

  const cityDropdownStyle = {
    display: 'none',
    position: 'absolute',
    left: '100%',
    top: 0,
    backgroundColor: '#00B98B',
    padding: '1rem',
    minWidth: '150px',
  };

  const navBarWrapperStyle={
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

//   <div style={dropdownStyle}>
//               {Object.entries(destinations).map(([country, cities]) => (
//                 <div key={country} style={countryStyle} onMouseEnter={() => handleMouseEnter(country)} onMouseLeave={handleMouseLeave}>
//                   {country}
//                   <div style={{...cityDropdownStyle, display: activeDropdown === country ? 'block' : 'none'}}>
//                     {cities.map(city => (
//                       <div key={city} style={{marginBottom: '0.25rem'}}>
//                         <Link to="#" style={{...linkStyle, fontSize: '0.9rem'}}>{city}</Link>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

  return (
    <nav style={navbarStyle}>

        
      <div style={navContainerStyle}>
        {/* <div style={logoStyle}>Travel Logo</div> */}
        <div style={logoStyle}>
            <img src={LogoImg} alt="Company Logo" width='120rem'/>
          </div>
       
        <button style={hamburgerStyle} onClick={toggleMenu}>
          ☰
        </button>
        <ul style={navLinksStyle}>
          <li style={navLinkStyle}><Link to="/" style={linkStyle}>Home</Link></li>
          <li style={navLinkStyle} onMouseEnter={() => handleMouseEnter('destinations')} onMouseLeave={handleMouseLeave}>
            <Link to="/destinations" style={linkStyle}>Destinations</Link>
          </li>
          <li style={navLinkStyle}><Link to="/trips" style={linkStyle}>Tours</Link></li>
          <li style={navLinkStyle}><Link to="/activities" style={linkStyle}>Activities</Link></li>
          <li style={navLinkStyle}><Link to="/accommodations" style={linkStyle}>Accommodations</Link></li>
          <li style={navLinkStyle}><Link to="/trips" style={linkStyle}>Pages</Link></li>
          <li style={navLinkStyle}><Link to="/about" style={linkStyle}>About</Link></li>
          {/* <li style={navLinkStyle}><Link to="/packages" style={linkStyle}>Packages</Link></li> */}
          <li style={navLinkStyle}><Link to="/blogs" style={linkStyle}>Blog</Link></li>
          {/* <li style={navLinkStyle}><Link to="/dashboard" style={linkStyle}>My Account</Link></li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
