import React from 'react';
import '../styles/ResponsiveFooter.css'

const ResponsiveFooter = () => {

  const whatsappNumber = '+254723595924';
  const message = 'Hello, I have a question about your tours.';
  const encodedMessage = encodeURIComponent(message);
  // <p>Open from 6 AM to 9 PM everyday.</p>

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p><span className="icon">📞</span><a 
          href='tel:+254723595924' target='_blank'>+254723595924</a> </p>
          <p><span className="icon email">✉</span>
          <a href="mailto:info@mwakaziadventures.com" target='_blank'>
          info@mwakaziadventures.com </a></p>
          <p><span className="icon">📍</span> Nairobi, Kenya</p>
          <p><span className="icon">▶️</span></p>
        </div>
        <div className="footer-section">
          <h3>Destinations</h3>
          <ul>
            <li>Kenya</li>
            <li>Tanzania</li>
            <li>South Africa</li>
            <li>Morocco</li>
            <li>Namibia</li>
            <li>Botswana</li>
            <li>Zambia</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Activities</h3>
          <ul>
            <li>City Tour</li>
            <li>Trekking</li>
            <li>Jungle Safari</li>
            <li>Cycling</li>
            <li>Hiking</li>
            <li>Boating</li>
            <li>Game Drives</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Trip Types</h3>
          <ul>
            <li>Nature Friendly</li>
            <li>Budget Travel</li>
            <li>Cultural</li>
            <li>Child-friendly</li>
            <li>High Altitude</li>
            <li>Dog-friendly</li>
          </ul>
        </div>
      </div>
      <div className="scroll-to-top">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          ▲
        </button>
      </div>
    </footer>
  );
};

export default ResponsiveFooter;