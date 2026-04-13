import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from "../context/AuthContext"
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
  const navigate=useNavigate()
  const{user,logout}=useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  function handleLogout() {
    logout()
    setDropdownOpen(false)
    navigate("/")
  }
  return (
    <div className='bg-purple-950 shadow-lg flex items-center justify-between px-6 py-3 sticky top-0 z-50'> {/*sticky top-0 z-50 — navbar sticks to top of screen when you scroll down. z-50 makes sure it stays above all other content (like a layer on top). */}
      <img src="/logo.png.png" alt="Logo" className="rounded-full w-12 h-12 hover:scale-110 transition duration-300 cursor-pointer" onClick={() => navigate("/")}/>
      <div className='flex gap-6'>
        <Link to="/" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Home</Link>
        {user ? (
            //logged in
          <div className="relative">
                        
                        {/* Profile Circle */}
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)} //if false=true and true=false
                            className="bg-yellow-400 text-purple-950 font-bold w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-300 transition duration-300 text-lg"
                        >
                            {user.name.charAt(0)}
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                
                                {/* User info at top */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-bold text-purple-950">{user.name}</p>
                                    <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                                </div>

                                {/* Links */}
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-950 transition duration-200"
                                >
                                    👤 Profile
                                </Link>

                                <Link
                                    to="/dashboard"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-950 transition duration-200"
                                >
                                    📊 Dashboard
                                </Link>

                                <div className="border-t border-gray-100 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition duration-200"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
        ): (
            //not logged in
            <>
                <Link to="/login" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Login</Link>
                <Link to="/register" className='text-white hover:text-yellow-400 transition duration-300 text-lg font-medium'>Register</Link>
            </>
        )}
      </div>
    </div>
  )
}

export default Navbar
