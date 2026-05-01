import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const ProviderDashboard = () => {
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [reviews,setReviews]=useState([])
    const [sentiments,setSentiments]=useState({})

    useEffect(() => {
        async function fetchBookings() {
            const token = localStorage.getItem("token")
            const res = await axios.get("http://localhost:5000/api/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setBookings(res.data)
        }
        async function fetchReviews() {
            const token = localStorage.getItem("token")
            const res = await axios.get("http://localhost:5000/api/reviews/provider", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setReviews(res.data)

            //analyze sentiment for each review
            const sentimentResults={}
            for (const review of res.data){
                const sentiment = await analyzeSentiment(review.comment)
                sentimentResults[review._id] = sentiment
            }
            setSentiments(sentimentResults)
        }
        fetchBookings()
        fetchReviews()
    }, [])

    async function handleStatus(bookingId,status){
        console.log("bookingId:", bookingId)
        console.log("status:", status)
        const token=localStorage.getItem("token")
        await axios.patch(`http://localhost:5000/api/bookings/${bookingId}`,{
            status //send new status in body
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setBookings(bookings.map(b=>b._id===bookingId?{...b,status}:b)) //loop through booking then check if its the one we just updated if yes spread all existing fields but override status with new one 
        //Why we used map function here ===>directly update the ONE booking in state,No extra API call! and Instant UI update! 
    }

    async function analyzeSentiment(reviewText) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze the sentiment of this review and reply with ONLY one word - either "Positive", "Negative", or "Neutral". Nothing else, just one word.
                            
                            Review: "${reviewText}"`
                        }]
                    }]
                })
            }
        )
        const data = await response.json()
        const result = data.candidates[0].content.parts[0].text.trim()
        return result
    } catch (err) {
        return "Neutral"  // default if API fails
    }
}

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-10">

            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-purple-950">
                    Welcome, {user.name}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's your service overview for today
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Total Requests", value: bookings.length, color: "bg-purple-100 text-purple-700" },
                    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "bg-yellow-100 text-yellow-700" },
                    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "bg-green-100 text-green-700" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${stat.color}`}>
                            {stat.label}
                        </div>
                        <p className="text-4xl font-bold text-purple-950">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Incoming Requests */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-purple-950 mb-6">
                    Incoming Booking Requests
                </h2>

                {bookings.length === 0 ? (
                    <p className="text-gray-400">No requests yet.</p>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl mb-4 hover:shadow-sm transition">
                            <div>
                                <p className="font-bold text-purple-950">{booking.category}</p>
                                <p className="text-gray-500 text-sm">📍 {booking.address}</p>
                                <p className="text-gray-500 text-sm">📅 {new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-gray-500 text-sm">👤 Customer: {booking.customerId?.name}</p> {/*customerId came from bookingController when we populated it */}
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold
                                ${booking.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
                                ${booking.status === "accepted" ? "bg-blue-100 text-blue-700" : ""}
                                ${booking.status === "completed" ? "bg-green-100 text-green-700" : ""}
                                ${booking.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                            `}>
                                {booking.status}
                            </div>
                            {/*only show buttons of accept and reject if booking is pending*/}
                            {booking.status==='pending' &&(
                                <div className='flex gap-2 mt-2'>
                                    <button onClick={()=>handleStatus(booking._id,"accepted")} className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-green-600 transition duration-300">Accept</button>
                                    <button onClick={() => handleStatus(booking._id, "rejected")} className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition duration-300">
                                        Reject
                                    </button>
                                    {/*we use arrow fun because===> () => creates a new function that waits to be called and if we dont use arrow function that fun calls immediately on render*/}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-8">
                <h2 className="text-xl font-bold text-purple-950 mb-6">
                    Customer Reviews
                </h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-400">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="p-4 border border-gray-100 rounded-xl mb-4 hover:shadow-sm transition">
                            
                            {/* Star Rating */}
                            {/*this star rating is span tag that means just to see rating*/}
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`text-lg ${review.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 text-sm mb-2">{review.comment}</p>

                            {/* Customer Name */}
                            <p className="text-gray-400 text-xs mb-3">
                                — {review.customerId?.name || "Anonymous"}
                            </p>

                            {/* Sentiment Tag */}
                            {sentiments[review._id] ? (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    sentiments[review._id] === "Positive"
                                        ? "bg-green-100 text-green-700" //this controls color
                                        : sentiments[review._id] === "Negative"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}>
                                    {sentiments[review._id] === "Positive" ? "😊 Positive"  //this controls text
                                    : sentiments[review._id] === "Negative" ? "😟 Negative" 
                                    : "😐 Neutral"}
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">
                                    Analyzing...
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>

        
    )
}

export default ProviderDashboard



//accepted-rejected id full flow
//MongoDB creates booking with _id: "abc123"
//         ↓
// Backend sends to frontend via res.json()
//         ↓
// Frontend stores in bookings state
//         ↓
// .map() loops → each booking has ._id
//         ↓
// Button onClick passes booking._id to handleStatus
//         ↓
// handleStatus sends to backend via axios.patch URL
//         ↓
// Backend reads from req.params.id
//         ↓
// MongoDB finds that exact document
//         ↓
// Updates status!

//Are booking._id and bookingId the same?
// YES! Just different variable names at different stages:

//booking._id   // in the .map() — property of booking object
     //↓
// passed as argument to handleStatus:
//handleStatus(booking._id, "accepted")
// received as parameter:
//async function handleStatus(bookingId, status)
//                          ↑
//                   bookingId = "abc123"
//                   same value, different name!