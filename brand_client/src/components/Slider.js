import React, { useState, useEffect } from 'react';
import img1 from '../images/elementaita.jpg'

import img2 from '../images/abadare.jpg'

import img3 from '../images/jobug1.jpg'

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    { src: img1, text: 'Beach Getaway - To the Kenyan Coast' },
    { src: img2, text: 'Tropical Paradise - Discover Mombasa' },
    { src: img3, text: 'Coastal Adventure - Explore Diani' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="beach-getaway">
      <img
        src={images[currentIndex].src}
        alt="Beach scene"
        className="background-image"
      />
      <div className="overlay">
        <h2 className="title">{images[currentIndex].text}</h2>
        <button className="book-now-button">BOOK NOW</button>
      </div>
      <style jsx>{`
        .beach-getaway {
          position: relative;
          width: 100%;
          height: 100vh;
        }
        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .title {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          text-align: center;
          margin-bottom: 20px;
        }
        .book-now-button {
          background-color: #f4a261;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .book-now-button:hover {
          background-color: #e76f51;
        }
        @media (min-width: 768px) {
          .title {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Slider;