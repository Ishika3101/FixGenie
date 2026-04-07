import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String
    }
},{timestamps:true});

const Review =mongoose.model("Review",reviewSchema);

export default Review