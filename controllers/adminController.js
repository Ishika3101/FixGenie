import User from "../models/user.js"
import Booking from "../models/Booking.js"

const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find({}).select("-password") //empty filter=get everyone
        return res.status(200).json(users)
    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const approveProvider=async(req,res)=>{
    try{
        const {providerId}=req.params
        //check if user exist or not in db
        const user = await User.findById(providerId)
        if(!user){
            return res.status(404).json({message:"User not found"}) //404=what you re looking for doesnt exist
        }
        if(user.role !== "provider") {
            return res.status(400).json({ message: "User is not a provider" }) //400=bad req
        }
        const updatedUser=await User.findByIdAndUpdate(providerId,{isVerified:true},{new:true}).select("-password")
        return res.status(200).json(updatedUser)
        
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const deleteUser=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const deleted=await User.findByIdAndDelete(id)
        return res.status(200).json({message:"User deleted successfully"})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const getAllBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({}) //fetch all documents but it only contains customerId and ProviderId thats why we populate
            .populate("customerId", "name email city")
            .populate("providerId", "name email city")
        return res.status(200).json(bookings)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export {getAllUsers,approveProvider,deleteUser,getAllBookings}    