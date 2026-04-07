import User from "../models/user.js"

const getAllProviders=async (req,res)=>{
    try{
        const providers=await User.find({role:"provider",isVerified:true})
        res.status(200).json(providers)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const searchProviders=async(req,res)=>{
    try{
        const{city,category}=req.query //extract from URL
        const filter={role:"provider",isVerified:true}
        if(city) filter.city={$regex: new RegExp(city,"i")} //i means ignore case
        if(category) filter.category={$regex: new RegExp(category,"i")}
        const providers=await User.find(filter)
        res.status(200).json(providers)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const getProviderById=async(req,res)=>{
    try{
        const id=req.params.id
        const user=await User.findById(id)
        if(!user) {
            return res.status(404).json({ message: "Provider not found" })
        }
        if(user.role!="provider"){
            res.status(404).json({message:"Provider not found"})
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const updateProviderProfile=async(req,res)=>{
    try{
        // console.log("req.user:", req.user)
        if(req.user.role!=="provider"){ //req.user._id (comes from auth middleware)
           return res.status(403).json( {message: "Only providers can update profile"})
        }
        const{bio, category,experience,city,phone,profilePhoto}=req.body
        const user=await User.findByIdAndUpdate(req.user._id,{bio, category,experience,city,phone,profilePhoto},{new:true}).select("-password") //new set to true means return updated version
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
//Client sends request
//       ↓
// server.js receives it
//       ↓
// protect middleware runs  ← this is where req.user gets attached
//       ↓
// controller runs  ← req.user is available here

export {getAllProviders,searchProviders,getProviderById,updateProviderProfile}