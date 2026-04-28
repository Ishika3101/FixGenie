import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const OAuthSuccess = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        // Read token from URL
        const params = new URLSearchParams(window.location.search)
        //Remember our backend redirects to:
       // http://localhost:5173/oauth-success?token=abc123&role=customer&name=Ishika
       // window.location.search = everything after ?
        const token = params.get("token")
        const role = params.get("role")
        const name = params.get("name")

        if (token) {
            // Save to auth context
            login({ name, role }, token)
            navigate("/")
        } else {
            navigate("/login")
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-purple-950 font-semibold text-xl">
                Logging you in...
            </p>
        </div>
    )
}

export default OAuthSuccess

//full flow
// Google approves
//         ↓
// Backend redirects to:
// /oauth-success?token=abc123&role=customer&name=Ishika
//         ↓
// OAuthSuccess page loads
//         ↓
// useEffect runs immediately
//         ↓
// reads token, role, name from URL
//         ↓
// login() → saves to localStorage + AuthContext
//         ↓
// navigate("/") → goes home
//         ↓
// Navbar shows "Welcome Ishika!" ✅

//Why do we need this page at all?
// Backend can't directly talk to frontend AuthContext
//         ↓
// So backend puts token in URL
//         ↓
// This page reads the URL
//         ↓
// And saves token to AuthContext

// It's like a "middleman" page that
// bridges backend redirect → frontend auth!