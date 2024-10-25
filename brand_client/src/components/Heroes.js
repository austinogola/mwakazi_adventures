import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  useMemo,
} from "react";

const Heroes = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([
    {
      src: "/api/placeholder/1200/600",
      title: "Welcome to Our Website",
      description: "Discover amazing experiences with us",
    },
    {
      src: "/api/placeholder/1200/600",
      title: "Explore the World",
      description: "Unforgettable adventures await you",
    },
    {
      src: "/api/placeholder/1200/600",
      title: "Create Memories",
      description: "Every journey is a story waiting to be told",
    },
  ]);

  const [loadedImages, setLoadedImages] = useState({});
  const [fade, setFade] = useState(true); // To control fade-in/out effect
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const imageRefs = useRef([]);

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
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setFade(true); // Trigger fade-in after updating the image
    }, 500); // Match this to the transition duration
  }, [images.length]);

  const preloadImages = (imageArray) => {
    imageArray.forEach((image) => {
      if (!loadedImages[image.src]) {
        // Preload only if not already loaded
        const img = new Image();
        img.src = image.src;
        img.onload = () =>
          setLoadedImages((prev) => ({ ...prev, [image.src]: true }));
      }
    });
  };

  useEffect(() => {
    const fetchHeroTrips = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/v1/trips?size=3`);
        const data = await response.json();
        const fetchedImages = data.trips.map((item) => ({
          src: item.images[0] || "", // Avoid missing src
          title: item.title,
          description: item.catch_phrase || "",
        }));
        setImages(fetchedImages);
        preloadImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching hero trips:", error);
      }
    };

    fetchHeroTrips();
    const intervalId = setInterval(nextImage, 5000);
    return () => clearInterval(intervalId);
  }, [nextImage]);

  const sectionStyle = {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  };

  const imageHolderStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: fade ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  };

  const textContainerStyle = {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "50%",
    transform: "translateY(-50%)",
    padding: "2rem",
    color: "white",
    opacity: fade ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
  };

  const headingStyle = {
    fontSize: "2.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const paragraphStyle = {
    fontSize: "1.25rem",
    color: "white",
  };

  const buttonStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.5)",
    border: "none",
    borderRadius: "50%",
    padding: "0.5rem",
    cursor: "pointer",
    fontSize: "1.5rem",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const leftButtonStyle = {
    ...buttonStyle,
    left: "1rem",
  };

  const rightButtonStyle = {
    ...buttonStyle,
    right: "1rem",
  };

  const currentImage = useMemo(
    () => images[currentImageIndex],
    [currentImageIndex, images]
  );

  return (
    <section style={sectionStyle}>
      <div style={imageHolderStyle}>
        {currentImage?.src && (
          <img src={currentImage.src} style={imageStyle} loading="lazy" />
        )}
      </div>
      <div style={overlayStyle} />
      {currentImage && (
        <div style={textContainerStyle}>
          <h1 style={headingStyle}>{currentImage.title}</h1>
          <p style={paragraphStyle}>{currentImage.description}</p>
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
