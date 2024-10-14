import React, { useState } from 'react';

const HeroSection = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', { destination, startDate, endDate });
  };

  const heroStyle = {
    backgroundImage: 'url("/api/placeholder/1600/900")', // Replace with your actual background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
  };

  const searchBlockStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#00B98B',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  };

  const contentStyle = {
    color: 'white',
    textAlign: 'right',
    maxWidth: '500px',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  };

  return (
    <section style={heroStyle}>
      <div style={containerStyle}>
        <div style={searchBlockStyle}>
          <form onSubmit={handleSearch} style={formStyle}>
            <input
              type="text"
              placeholder="Where do you want to go?"
              style={inputStyle}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <input
              type="date"
              placeholder="Start Date"
              style={inputStyle}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              style={inputStyle}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button type="submit" style={buttonStyle}>Search Trips</button>
          </form>
        </div>
        <div style={contentStyle}>
          <h1 style={headingStyle}>Discover Your Next Adventure</h1>
          <p style={paragraphStyle}>Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.</p>
          <button style={buttonStyle}>Start Your Journey</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;