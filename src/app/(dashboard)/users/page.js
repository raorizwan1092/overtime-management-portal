import React from 'react'

const page = () => {
  return (
    <div>
       <h1>Main Content Area</h1>
              <p>Your main content goes here. This area will scroll if content overflows.</p>
              
              {/* Add some sample content to demonstrate scrolling */}
              {[...Array(20)].map((_, index) => (
                <p key={index}>Sample content line {index + 1}</p>
              ))}
    </div>
  )
}

export default page