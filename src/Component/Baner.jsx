import React from 'react'
import pic4 from '../assets/pic4.jpg'

function Banner() {
  return (
    <div className="w-full overflow-hidden">
      <img 
        src={pic4} 
        alt="Banner" 
        className="w-full -my-34 object-cover" // Removes 3rem from top and bottom
      />
    </div>
  )
}

export default Banner