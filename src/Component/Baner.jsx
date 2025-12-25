import React, { useState, useEffect } from 'react';
import ban5 from '../assets/ban5.jpg';
import ban1 from '../assets/ban1.jpg';
import ban4 from '../assets/ban4.jpg';

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const bannerImages = [
    { src: ban5, alt: "Banner 1" },
    { src: ban1, alt: "Banner 2" },
    { src: ban4, alt: "Banner 3" }
  ];

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative h-screen min-h-[500px] overflow-hidden">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banner;