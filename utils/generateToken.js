import jwt from "jsonwebtoken";

const generateToken=(userId)=>{
    const token= jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"30d"});
}

export default generateToken;

//1. User sends register request
//         ↓
// 2. authController creates user in MongoDB
//         ↓
// 3. MongoDB gives back user object with _id
//         ↓
// 4. authController calls generateToken(user._id)
//         ↓
// 5. generateToken receives that _id as "userId" parameter
//         ↓
// 6. jwt.sign({ id: userId }, secret) creates token
//         ↓
// 7. Token sent back to frontend