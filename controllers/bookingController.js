import Booking from "../models/Booking.js";
import User from "../models/user.js";

const createBooking=(async(req,res)=>{
    try{
        //check if the user is customer or not because only customer can make create booking
        if(req.user.role!=="customer"){ //req.user (lowercase u) — the logged in user object attached by middleware:req.user    = just ONE user object
            //   (the person currently making the request) and User is used for CRUD operations from database
            res.status(403).json({message:"Only customers can create Booking."})
        }
        const {providerId,category,date,address,notes,price}=req.body;
        const customerId=req.user._id;//write outside curly braces to use in booking otherwise undefined
        
        //check provider before creating booking
        const provider = await User.findById(providerId)
        if(!provider || !provider.isVerified) {
            return res.status(404).json({ message: "Provider not found" })
        }
        const booking=new Booking({customerId,providerId,category,date,address,notes,price});
        const savedbooking=await booking.save()
        return res.status(201).json(savedbooking) //201-request successful and something is created
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

const getMyBookings=async(req,res)=>{
    try{
        // to check if the user is neither customer nor provider
        if(req.user.role!=="customer" && req.user.role!=="provider"){
            res.status(400).json({message:"Neither a customer nor a provider."})
        }

        //filter building
        const filter={} //start empty
        if(req.user.role==="customer") filter.customerId=req.user._id 
        if(req.user.role==="provider") filter.providerId=req.user._id

        const myBookings=await Booking.find(filter) //booking.find for both filters:customerId,providerId
            .populate("customerId","name email phone city") //(field to populate,fields to fetch from User schema)
            .populate("providerId","name email phone city")
            //Mongoose sees customerId and providerid has ref: "User" in schema, goes to users collection, finds that id and replaces it with the full user object — but only the fields you specified!

        res.status(200).json(myBookings)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const updateBookingStatus=async(req,res)=>{
    try{
        const {id}=req.params
        const {status}=req.body

        const booking=await Booking.findById(id)
        if(!booking) return res.status(404).json({message:"Booking not found"})

        if(req.user.role==="customer"){ //only allowed to cancel
            if(!["cancelled"].includes(status)){
                return res.status(400).json({message:"Invalid status"})
            }
        }
        if(req.user.role==="provider"){ //only allowed to accept and reject
            if(!["accepted","rejected"].includes(status)){
                return res.status(400).json({message:"Invalid status"})
            }
        }
        const updated=await Booking.findByIdAndUpdate(id,{status},{new:true})
        res.status(200).json(updated)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export {createBooking,getMyBookings,updateBookingStatus}