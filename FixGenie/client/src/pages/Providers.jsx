import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Providers = () => {
    const [city, setCity] = useState("")
    const [category, setCategory] = useState("")
    const [providers, setProviders] = useState([])
    const [searched, setSearched] = useState(false)
    // false = user hasn't searched yet
    const navigate = useNavigate()

    async function handleSearch() {
        const res = await axios.get(
            `http://localhost:5000/api/providers/search?category=${category}&city=${city}`
        )
        setProviders(res.data)
        setSearched(true) // ← becomes true AFTER first search
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Search Header */}
            <div className="bg-purple-950 px-10 py-14 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Find a Service Provider
                </h1>
                <p className="text-purple-300 mb-8">
                    Search verified professionals in your city
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <input
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="px-5 py-3 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-5 py-3 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option value="">Select Category</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Painting">Painting</option>
                        <option value="AC Repair">AC Repair</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-yellow-400 text-purple-950 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition duration-300"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="px-10 py-10">
                {searched && providers.length === 0 && (
                    <p className="text-center text-gray-400 text-lg">
                        No providers found. Try a different city or category!
                    </p>
                )}
                {/*Only shows message AFTER user clicks Search
                If both conditions true → show message
                searched=false → don't show anything yet*/} 

                <div className="grid grid-cols-3 gap-6">
                    {providers.map((provider) => (
                        <div key={provider._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">
                            
                            {/* Provider Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700">
                                    {provider.name.charAt(0)}
                                    {/*So instead of a profile photo (which providers don't have yet)
                                    // We show first letter of their name in a colored circle
                                    // Like Google's avatar when you don't have a photo! */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-purple-950 text-lg">{provider.name}</h3>
                                    <p className="text-gray-500 text-sm">{provider.category}</p>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-1"> {provider.city}</p>
                            <p className="text-gray-500 text-sm mb-4"> {provider.averageRating} rating</p>
                            
                            {provider.bio && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.bio}</p>
                            )}
                            {/* provider.bio && = if bio exists, show it
                                  if bio is empty, show nothing */}

                            <button
                                onClick={() => navigate(`/bookings/${provider._id}`)}
                                className="w-full bg-purple-950 text-white font-bold py-2 rounded-xl hover:bg-purple-800 transition duration-300"
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Providers