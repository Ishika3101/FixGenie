import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import {useAuth} from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {login,user}=useAuth()
  const navigate=useNavigate()

  //if already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user])
  async function handleSubmit(e) {
    e.preventDefault();
    try{
        const response=await axios.post("http://localhost:5000/api/auth/login",{
            //the body we are sending
            email,
            password
        })
        console.log(response.data)
        //login() stores token in localStorage, user in AuthContext
        login(response.data.user,response.data.token)
        navigate("/")
        //Navbar reads user from AuthContext → shows profile icon
    }catch(error){
        console.log(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-purple-950 flex-col items-center justify-center text-center px-10">
      {/*hidden   →  display: none  (hidden on ALL screens by default)
md:flex  →  display: flex  (but show as flex on medium+ screens)*/}
        <img
          src="/logo.png.png" // fixed
          alt="Logo"
          className="w-24 h-24 mb-6 rounded-full"
        />

        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to FixGenie
        </h1>

        <p className="text-purple-300 text-lg mb-6">
          Your trusted home service partner.
        </p>

        {/* Added features (makes it feel real product) */}
        <div className="text-purple-200 space-y-2 text-sm">
          <p>✔ Verified professionals</p>
          <p>✔ Quick booking in minutes</p>
          <p>✔ Trusted & secure services</p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold text-purple-950 mb-2">
            Welcome back!
          </h2>

          <p className="text-gray-500 mb-6">
            Login to book your next service
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            <button
              type="submit"
              className="bg-purple-950 text-white font-semibold py-3 rounded-xl hover:bg-purple-800 hover:scale-[1.02] transition duration-300 shadow-md"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-200" />
          </div>

          {/* Google OAuth Button */}
          <button
              onClick={() => window.location.href = "http://localhost:5000/auth/google"} //window.location.href = changes the browser URL
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition font-semibold text-gray-700"
          >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
              Continue with Google
          </button>
          {/*Why not axios.get like we normally do?
          axios.get → stays on same page, gets JSON back ❌

window.location.href → actually NAVIGATES browser to that URL ✅ */}

          <p className="text-sm text-right mt-2 text-gray-400 hover:text-purple-600 cursor-pointer">
            Forgot password?
          </p>

          <p className="text-gray-500 text-center mt-6">
            Not a user?{" "}
            <Link
              to="/register"
              className="text-purple-700 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;