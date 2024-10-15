import React, { useState, useEffect } from 'react';
import '../styles/HeroSlider.css'
import img1 from '../images/elementaita.jpg'
const HeroSlider=()=>{
    const items = [
        { src: img1, text: 'Beach Getaway - To the Kenyan Coast' },
        { src: img1, text: 'Tropical Paradise - Discover Mombasa' },
        { src: img1, text: 'Coastal Adventure - Explore Diani' },
      ];

      const [selectedItem,setSelected]=useState(items[0])
    
    return (
        <div className='heroSlider'>
            <div className='heroHolder'>
                <div className='imageHolder'>
                    <img src={selectedItem.src}/>
                    <div className="overlay"></div>
                </div>
                <div className='textHolder'>
                    <h2>{selectedItem.text.toUpperCase()}</h2>
                    <div>
                        <a >
                            <button>BOOK NOW</button>
                        </a>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSlider