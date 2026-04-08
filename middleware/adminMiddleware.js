const isAdmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Admin access only"}) //403:I understand your request… but you’re NOT allowed to access this
    }
    next()
}

export default isAdmin

//Request comes in
//       ↓
// protect runs    → fetches user from DB → attaches req.user
//       ↓
// isAdmin runs    → reads req.user.role  → allows or blocks
//       ↓
// getAllUsers runs → handles the request