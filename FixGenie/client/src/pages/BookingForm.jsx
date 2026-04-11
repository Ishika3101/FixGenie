import React,{useState,useEffect} from 'react'
import {useParams,useNavigate} from "react-router-dom"
import axios from 'axios'

const BookingForm = () => {
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false)
    const {providerId}=useParams()
    const[date,setDate]=useState("")
    const[address,setAddress]=useState("")
    const[notes,setNotes]=useState("")
    const[provider,setProvider]=useState(null) //null is falsy nothing inside
    //Why not empty string ""? ===> // provider is a STRING
               // provider.category = undefined
               // provider.name = undefined
    //Why not empty object {}?===> // if(!provider) = false because {} is truthy
               // Loading... never shows!
               // provider.name = undefined but no crash

    useEffect(() => { //useEffect itself can't be async so we put async function inside useEffect
        async function fetchProvider(){
            const res=await axios.get(`http://localhost:5000/api/providers/${providerId}`)
            setProvider(res.data)
        }
        fetchProvider()
    }, [providerId])

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const token=localStorage.getItem("token")
            await axios.post("http://localhost:5000/api/bookings",{
                providerId,
                category:provider.category,
                date,
                address,
                notes
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            navigate("/dashboard")
        }catch (error) {
            console.log(error.response.data.message)  // show error
        }finally {
            setLoading(false)
        }
    }
     if (!provider) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-purple-950 text-xl font-bold">Loading...</p>
        </div>
    )
  return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">

                {/* Provider Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-purple-50 rounded-xl">
                    <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700">
                        {provider.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-950 text-lg">{provider.name}</h3>
                        <p className="text-gray-500 text-sm">{provider.category} • {provider.city}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-purple-950 mb-6">
                    Confirm Your Booking
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Date */}
                    <div>
                        <label className="text-gray-600 text-sm font-medium mb-1 block">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-gray-600 text-sm font-medium mb-1 block">
                            Your Address
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-gray-600 text-sm font-medium mb-1 block">
                            Additional Notes (optional)
                        </label>
                        <textarea
                            placeholder="Describe your problem..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-950 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default BookingForm
