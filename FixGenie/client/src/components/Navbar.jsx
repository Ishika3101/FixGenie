import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='bg-purple-950 shadow-lg flex items-center justify-between px-6 py-3 sticky top-0 z-50'> {/*sticky top-0 z-50 — navbar sticks to top of screen when you scroll down. z-50 makes sure it stays above all other content (like a layer on top). */}
      <img src="/logo.png.png" alt="Logo" className="rounded-full w-20 h-20 hover:scale-110 transition duration-300 cursor-pointer"/>
      <div className='flex gap-6'>
        <Link to="/" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Home</Link>
        <Link to="/login" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Login</Link>
        <Link to="/register" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Register</Link>
      </div>
    </div>
  )
}

export default Navbar
