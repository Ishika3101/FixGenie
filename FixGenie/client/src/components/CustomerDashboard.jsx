import React,{useEffect,useState} from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CustomerDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const[bookings,setBookings]=useState([])
    useEffect(()=>{
        async function fetchBookings(){
            const token=localStorage.getItem("token")
            const res=await axios.get("http://localhost:5000/api/bookings",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setBookings(res.data)
        }
        fetchBookings()
    },[])

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-10">
            
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-purple-950">
                    Welcome back, {user.name}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your bookings
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Total Bookings", value: bookings.length, color: "bg-purple-100 text-purple-700" },
                    { label: "Pending", value: bookings.filter(b=>b.status==="pending").length, color: "bg-yellow-100 text-yellow-700" },
                    { label: "Completed", value: bookings.filter(b=>b.status==="completed").length, color: "bg-green-100 text-green-700" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${stat.color}`}>
                            {stat.label}
                        </div>
                        <p className="text-4xl font-bold text-purple-950">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-purple-950 mb-4">Quick Actions</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-purple-950 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-800 transition duration-300"
                >
                    Book a Service
                </button>
            </div>
            {/* Bookings List */}
<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
    <h2 className="text-xl font-bold text-purple-950 mb-6">My Bookings</h2>
    
    {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet!</p>
    ) : (
        bookings.map((booking) => (
            <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl mb-4 hover:shadow-sm transition">
                <div>
                    <p className="font-bold text-purple-950">{booking.category}</p>
                    <p className="text-gray-500 text-sm">{booking.address}</p>
                    <p className="text-gray-500 text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                    {/*new Date() converts it to a Date object
                    .toLocaleDateString() converts to readable format*/}
                    <p className="text-gray-500 text-sm">Provider: {booking.providerId?.name}</p>
                    {/*in bookingController we used .populate()?
                    populate("providerId", "name email phone city")
                    This replaces the ID with actual provider object!
                    Think of ? as a safety check:
                    "if this exists, get .name"
                    "if this is null, just return undefined safely"*/}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold
                    ${booking.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                    ${booking.status === "accepted" ? "bg-blue-100 text-blue-700" : ""}
                    ${booking.status === "completed" ? "bg-green-100 text-green-700" : ""}
                    ${booking.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                `}>
                    {booking.status}
                </div>
            </div>
        ))
    )}
</div>

        </div>
    )
}

export default CustomerDashboard