import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerUser= async(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const role=req.body.role;
    const city=req.body.city;
    try{
        const existingUser=await User.findOne({email}); //findOne returns null if not found
        if(existingUser){
            return res.status(400).json({ message: "User already exists" })
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        //create user in db
        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        city})
    //generate token
    const token=generateToken(user._id);
    res.status(201).json({
        token,
        user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    })}catch(err){
        res.status(500).json({message:err.message});
    }
}

const loginUser= async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" }) //400-bad request
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = generateToken(user._id)
        res.status(200).json({
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            city: user.city
        }
        })
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export {registerUser,loginUser}