import React,{useEffect,useState} from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CustomerDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const[reviewingId,setReviewingId]=useState(null) //stores which bookingId is being reviewed if null=no review form open
    const[rating,setRating]=useState(5)
    const[comment,setComment]=useState("")
    const [reviewedBookings, setReviewedBookings] = useState([])

    async function handleReview(bookingId, providerId) {
    try {
        const token = localStorage.getItem("token")
        await axios.post("http://localhost:5000/api/reviews", {
            bookingId, providerId, rating, comment
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setReviewingId(null) //closes form
        setRating(5)
        setComment("")
        setReviewedBookings(prev => [...prev, bookingId])
    } catch (error) {
        alert(error.response?.data?.message || "Something went wrong") // shows "Already reviewed this booking"
    }
}

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

    async function handleCancel(bookingId){ //status is always cancelled so need to pass it
        const token=localStorage.getItem("token")
        await axios.patch(`http://localhost:5000/api/bookings/${bookingId}`,{
            status:"cancelled"
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setBookings(bookings.map(b=>b._id===bookingId?{...b,status:"cancelled"}:b))
    }

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
                {booking.status === "pending" && (
                <button
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition duration-300"
                >
                    Cancel
                </button>
                )}
                {/* Leave Review button - only for completed bookings */}
                {booking.status === "completed" && (
                    <div className="mt-3">
                        {reviewedBookings.includes(booking._id) ? (
                          <span className="text-green-600 text-sm font-semibold">✅ Review Submitted</span>
                        ):reviewingId === booking._id ? ( // User clicks "Leave Review" on booking abc123: onClick={() => setReviewingId("abc123") // reviewingId = "abc123"
                            // Show form
                            <div className="bg-gray-50 rounded-xl p-4 mt-2">
                                <p className="font-semibold text-purple-950 mb-3">Leave a Review</p>             
                                {/* Star Rating */}
                                <div className="flex gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                {/* Comment */}
                                <textarea
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
                                />

                                {/* Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReview(booking._id, booking.providerId?._id)} //booking.providerId was populated by backend, so it's a full object {name, city, _id...}. We need just the _id to send to the review API! The ?. is optional chaining — safe in case providerId is somehow null.
                                        className="bg-purple-950 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-800 transition"
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        onClick={() => setReviewingId(null)} // Sets reviewingId back to null → form disappears, button reappears!
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Show button
                            <button
                                onClick={() => setReviewingId(booking._id)}
                                className="bg-yellow-400 text-purple-950 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-300 transition"
                            >
                                ⭐ Leave Review
                            </button>
                        )}
                    </div>
                            )}
                            </div>
                        ))
                    )}
                </div>

        </div>
    )
}

export default CustomerDashboard