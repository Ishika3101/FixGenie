import mongoose from "mongoose";

const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("FixGenie DB Connected");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

export default connectDB;// stops the entire node.js server immediately and exited because of an error
