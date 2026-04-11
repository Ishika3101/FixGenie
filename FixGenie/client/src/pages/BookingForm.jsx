import React,{useState,useEffect} from 'react'
import {useParams,useNavigate} from "react-router-dom"
import axios from 'axios'

const BookingForm = () => {
    const navigate=useNavigate()
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
    }
    }
    if (!provider) return <div>Loading...</div>
  return (
    <div>
        <p>Booking with: {provider.name}</p>
        <p>Category: {provider.category}</p>
        <form onSubmit={handleSubmit}>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
            <input type="text" placeholder="Your address" onChange={(e) => setAddress(e.target.value)} />
            <input type="text" placeholder="Notes (optional)" onChange={(e) => setNotes(e.target.value)} />
            <button type="submit">Confirm Booking</button>
        </form>
    </div>
  )
}

export default BookingForm
