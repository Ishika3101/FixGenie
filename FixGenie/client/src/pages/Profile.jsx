import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [phone, setPhone] = useState(user.phone || "")
    const [city, setCity] = useState(user.city || "")
    const [bio, setBio] = useState(user.bio || "")
    const [category, setCategory] = useState(user.category || "")
    const [experience, setExperience] = useState(user.experience || "")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.put("http://localhost:5000/api/providers/profile", {
                phone,
                city,
                bio,
                category,
                experience
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            navigate("/dashboard")
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-purple-950">{user.name}</h2>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Phone */}
                    <div>
                        <label className="text-gray-600 text-sm font-medium mb-1 block">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="text-gray-600 text-sm font-medium mb-1 block">
                            City
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Provider only fields */}
                    {user?.role === "provider" && (
                        <>
                            {/* Bio */}
                            <div>
                                <label className="text-gray-600 text-sm font-medium mb-1 block">
                                    Bio
                                </label>
                                <textarea
                                    placeholder="Tell customers about yourself..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-gray-600 text-sm font-medium mb-1 block">
                                    Service Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Carpentry">Carpentry</option>
                                    <option value="Painting">Painting</option>
                                    <option value="AC Repair">AC Repair</option>
                                </select>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="text-gray-600 text-sm font-medium mb-1 block">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-950 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Profile