import mongoose from "mongoose";

const userSchema=  new mongoose.Schema({ //creates a schema which is a blueprint
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["customer","provider","admin"],
        default:"customer"
    },
    phone:{
        type:String
    },
    city:{
        type:String
    },
    profilePhoto:{
        type:String
    },
    bio:{  //for providers
        type:String
    },
    category:{ 
        type:String
    },
    experience:{
        type:Number
    },
    isVerified:{
        type:Boolean,
        default:false //because admin will approve provider
    },
    averageRating:{
        type:Number,
        default:0
    },
    totalReviews:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true //because true is boolean
    }
},{timestamps:true}) //adds createdAt and updatedAt automatically

const User= mongoose.model("User",userSchema); //creates actual model from schema, the actual tool created for CRUD operations
export default User;