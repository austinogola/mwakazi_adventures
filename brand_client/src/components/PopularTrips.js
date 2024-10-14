import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PopularTrips.css';

const PopularTrips = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showItems, setShowItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const serverUrl = 'https://server.mwakaziadventures.com';
  const serverUrl=process.env.REACT_APP_SERVER_URL

  const handleBookNow = useCallback((item) => {
    navigate(`/booking?id=${item._id}`, { state: { tripDetails: item } });
  }, [navigate]);

  const fetchPopularTrips = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/trips?size=3`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const response = await res.json();
      setShowItems(response.trips);
      console.log(response)
    } catch (error) {
      console.error('Error fetching popular trips:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularTrips();
  }, [fetchPopularTrips]);

  const ImageWithLazyLoading = ({ src, alt, className }) => {
    const [imageSrc, setImageSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    const [imageRef, setImageRef] = useState();

    useEffect(() => {
      let observer;
      let didCancel = false;

      if (imageRef && imageSrc !== src) {
        if (IntersectionObserver) {
          observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (
                  !didCancel &&
                  (entry.intersectionRatio > 0 || entry.isIntersecting)
                ) {
                  setImageSrc(src);
                  observer.unobserve(imageRef);
                }
              });
            },
            {
              threshold: 0.01,
              rootMargin: '75%',
            }
          );
          observer.observe(imageRef);
        } else {
          // Fallback for older browsers
          setImageSrc(src);
        }
      }
      return () => {
        didCancel = true;
        if (observer && observer.unobserve) {
          observer.unobserve(imageRef);
        }
      };
    }, [src, imageSrc, imageRef]);

    return <img ref={setImageRef} src={imageSrc} alt={alt} className={className} />;
  };

  if (isLoading) {
    return <div>Loading popular trips...</div>;
  }

  return (
    <div className='popular-trips'>
      <div className='titleHolder'>
        <span>Popular</span><span>Trips</span>
      </div>
      
      <div className='items-holder'>
        {showItems.map((item) => (
          <div 
            key={item._id}
            className='itemHolder'
            onMouseEnter={() => setHoveredItem(item._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className='imageHolder'>
              <ImageWithLazyLoading src={item.images[0]} alt={item.title} />
              
              <div className={`overlay ${hoveredItem === item._id ? 'show' : ''}`}>
                <button 
                  className='bookNowButton'
                  onClick={() => handleBookNow(item)}
                >
                  Book Now
                </button>
              </div>
            </div>
            <div className='itemText'>
              <p className='categoryText'>Category: {item.categories[0]}</p>
              <h4>
                <Link to='/trips'>{item.title}</Link>
              </h4>
              <p>{item.price} USD</p>
              <p>
                Rating: 
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`text-xl ${index < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='button_holder'>
          <Link to='/trips'>
            <button>VIEW ALL TRIPS</button>
          </Link>
      </div>
    </div>
  );
};

export default PopularTrips;