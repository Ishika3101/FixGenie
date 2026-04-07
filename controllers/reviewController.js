import Review from "../models/Review.js"
import Booking from "../models/Booking.js"

const addReview=async(req,res)=>{
    try{
        //first check whether the user is customer or not
        if(req.user.role!=="customer"){ //check because only customer can rate
            return res.status(400).json({message:"Only customers can add reviews"})
        }
        const{providerId,bookingId,rating,comment}=req.body
        const booking=await Booking.findById(bookingId)
        if(!booking || booking.status!=="completed"){
            return res.status(400).json({message:"Can only review completed bookings"})
        }
//check for existing review
        const existing=await Review.findOne({bookingId})
        if(existing){
            return res.status(400).json({message:"Already reviewed this booking"})
        }
        const review = new Review({
            customerId: req.user._id,
            providerId,
            bookingId,
            rating,
            comment
        })
        await review.save()
        return res.status(201).json(review)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const getProviderReviews=async(req,res)=>{
    try{
        const {providerId}=req.params
        const reviews=await Review.find({providerId})
            .populate("customerId","name city") //(which field to populate,what to fetch)
        return res.status(200).json(reviews)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
//addReview saves    → customerId: "69d3655f..."
// populate sees      → ref: "User" on customerId field
// populate goes      → users collection, finds "69d3655f..."
// populate replaces  → customerId: { name: "Ishika", city: "Bhopal" }

export {addReview,getProviderReviews}