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