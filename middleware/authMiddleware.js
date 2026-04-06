import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect= async (req,res,next)=>{
    try{
        if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            //tocheck if token exists
        return res.status(401).json({ message: "Not authorized, no token" })
        }
        const token=req.headers.authorization.split(" ")[1] //we dont need the word bearer
        const decoded=jwt.verify(token,process.env.JWT_SECRET); //jwt.verify() does two things:Checks if token was signed with our secret — if tampered, throws error  Checks if token has expired — if expired, throws error
        const user=await User.findById(decoded.id).select("-password") //the - means EXCLUDE. Fetch everything except password field. No need to carry hashed password in every request.
        req.user=user //Attaches the full user object to the request. Now in ANY controller that uses this middleware, we can access:req.user.name etc
        next()
    }catch(error){
        res.status(401).json({message:"Not authorized"})
    }
}

export default protect