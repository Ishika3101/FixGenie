import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
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
    category:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected","completed"],
        default:"pending"
    },
    price:{
        type:Number,
    },
    notes:{  //if customer wants to add any comments or suggestions or needs anything
        type:String
    }
},{timestamps:true});

const Booking= mongoose.model("Booking",bookingSchema);

export default Booking;