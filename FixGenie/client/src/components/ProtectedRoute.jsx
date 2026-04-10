import {useAuth} from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute=({children})=>{
    // children = whatever is wrapped inside ProtectedRoute
    const {user,loading}=useAuth()

    if (loading) {
        return <div>Loading...</div> // wait for localStorage check
    }
    
    if(!user){
        return <Navigate to="/login"></Navigate>
    }
    return children
    // if user EXISTS → just render whatever is inside
}

export default ProtectedRoute