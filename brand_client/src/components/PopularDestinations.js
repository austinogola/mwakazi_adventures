import React from 'react';
import '../styles/PopularDestinations.css'
import watamu1 from '../images/watamu2.jpg'
import elementaita from '../images/elementaita.jpg'
import kijabeH from '../images/kijabehills.jpg'
import olJog from '../images/oljogi.jpg'
import abadare from '../images/abadare.jpg'

const PopularDestinations = () => {
  const packages = [
    { name: 'Malindi/Watamu Coast', packages: 3, image: watamu1},
    { name: 'Lake Elementaita', packages: 2, image: elementaita },
    { name: 'Kijabe Hills', packages: 2, image: kijabeH },
    { name: 'Ol Jogi Conservancy', packages: 2, image: olJog },
    { name: 'Abadare Ranges', packages: 1, image: abadare },
  ];

  return (
    <div className="popular-destinations">
      <div className="destinations-holder">
        {/* <div className="relative rounded-lg overflow-hidden">
          <img src={packages[0].image} alt={packages[0].name} className="bigImage" />
          <div className="first-div">
            <h2 className="first-text">{packages[0].name}</h2>
            <p>({packages[0].packages}) Packages</p>
          </div>
        </div> */}
        <div  className="small-image-div">
              <img src={packages[0].image} alt={packages[0].name} className="small-image" />
              <div className="small-div-text">
                <h3 className="small-text">{packages[0].name}</h3>
                <p>({packages[0].packages}) Packages</p>
              </div>
            </div>
        <div className="right-grid">
          {packages.slice(1).map((pkg, index) => (
            <div key={index} className="small-image-div">
              <img src={pkg.image} alt={pkg.name} className="small-image" />
              <div className="small-div-text">
                <h3 className="small-text">{pkg.name}</h3>
                <p>({pkg.packages}) Packages</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;