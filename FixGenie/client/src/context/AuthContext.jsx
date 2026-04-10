import React, {useContext,useState,useEffect,createContext} from "react"

const AuthContext= createContext()

//create the provider
export const AuthProvider=({children})=>{
    //null because nobody logged in yet
    const[user,setUser]=useState(null)
    const[loading,setLoading]=useState(true)

    // When page loads/refreshes:
    // Check localStorage → if user was logged in before → restore them
    useEffect(()=>{
        const savedUser=localStorage.getItem("user") || null;
        //if parsed value is falsy / undefined / broken=>fallback = null
        if(savedUser){
            setUser(JSON.parse(savedUser))            
        }
        setLoading(false)
    },[])

    const login=(userData,token)=>{
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(userData)) 
        setUser(userData)
    }

    const logout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{user,login,logout,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=> useContext(AuthContext)

// Page loads
// ↓
// AuthContext starts (user = null)
// ↓
// ProtectedRoute checks user → null → redirects to login ❌
// ↓
// useEffect runs AFTER and restores user → too late!


// Page loads
// ↓
// loading = true → ProtectedRoute shows "Loading..."
// ↓
// useEffect runs → restores user from localStorage
// ↓
// loading = false → ProtectedRoute checks user → user exists → show Dashboard ✅