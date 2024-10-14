import React, { useState, useEffect, useCallback,useRef  } from 'react';

const Heroes = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([{
    src: '/api/placeholder/1200/600',
    title: 'Welcome to Our Website',
    description: 'Discover amazing experiences with us'
  },
  {
    src: '/api/placeholder/1200/600',
    title: 'Explore the World',
    description: 'Unforgettable adventures await you'
  },
  {
    src: '/api/placeholder/1200/600',
    title: 'Create Memories',
    description: 'Every journey is a story waiting to be told'
  }
]);
  const [loadedImages, setLoadedImages] = useState({});
  const [fade, setFade] = useState(true); // To control fade-in/out effect
  const [isLoading, setIsLoading] = useState(true);
  const imageRefs = useRef([]);

  // const serverUrl = 'https://server.mwakaziadventures.com';
  // const serverUrl = 'http://localhost:5010';
  const serverUrl=process.env.REACT_APP_SERVER_URL
  const nextImage = useCallback(() => {
    setFade(false); // Trigger fade-out
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(true); // Trigger fade-in after updating the image
    }, 500); // Match this to the transition duration
  }, [images.length]);

  const prevImage = useCallback(() => {
    setFade(false); // Trigger fade-out
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setFade(true); // Trigger fade-in after updating the image
    }, 500); // Match this to the transition duration
  }, [images.length]);

  const preloadImages = (imageArray) => {
    imageArray.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [image.src]: true }));
    });
  };

  useEffect(() => {
    const fetchHeroTrips = () => {
      fetch(`${serverUrl}/api/v1/trips?size=3`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async (res) => {
          const response = await res.json();
          console.log(response)
          const fetchedImages = response.trips.map((item) => ({
            src: item.images[0],
            title: item.title,
            description: item.catch_phrase || '',
          }));
          setImages(fetchedImages);
          preloadImages(fetchedImages); // Preload the fetched images
        });
    };

    fetchHeroTrips();

    const intervalId = setInterval(nextImage, 5000); // Auto-swipe every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [nextImage]);

  const sectionStyle = {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
  };

  const imageHolderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: fade ? 1 : 0, // Control opacity for fade-in/out effect
    transition: 'opacity 0.5s ease-in-out', // Smooth fade effect
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  };

  const textContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '50%',
    transform: 'translateY(-50%)',
    padding: '2rem',
    color: 'white',
    opacity: fade ? 1 : 0, // Add fade effect to text as well
    transition: 'opacity 0.5s ease-in-out', // Match text transition to image
  };

  const headingStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    fontSize: '1.25rem',
    color:'white'
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    borderRadius: '50%',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '1.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const leftButtonStyle = {
    ...buttonStyle,
    left: '1rem',
  };

  const rightButtonStyle = {
    ...buttonStyle,
    right: '1rem',
  };

  return (
    <section style={sectionStyle}>
      <div style={imageHolderStyle}>
        {images.length > 0 && (
          <img
            src={images[currentImageIndex]?.src}
            alt={`Hero image ${currentImageIndex + 1}`}
            style={imageStyle}
            loading="lazy" // Lazy load the current image
          />
        )}
      </div>
      <div style={overlayStyle} />
      {images.length > 0 && (
        <div style={textContainerStyle}>
          <h1 style={headingStyle}>{images[currentImageIndex].title}</h1>
          <p style={paragraphStyle}>{images[currentImageIndex].description}</p>
          {/* <button>Book Now</button> */}
        </div>
      )}
      <button onClick={prevImage} style={leftButtonStyle}>
        &#8249;
      </button>
      <button onClick={nextImage} style={rightButtonStyle}>
        &#8250;
      </button>
    </section>
  );
};

export default Heroes;
