import React, { useState } from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[role,setRole]=useState("customer")
    const[error,setError]=useState("")

    const {user,login}=useAuth()
    const navigate=useNavigate()

    async function handleSubmit(event){
        event.preventDefault()
        try{
            const res=await axios.post("http://localhost:5000/api/auth/register",{
                name,
                email,
                password,
                role
            })
            console.log(res.data)
            login(res.data.user,res.data.token)
            navigate("/")
        }catch(err){
          setError(err.response?.data?.message || "Something went wrong")
        }
    }
  return (
    <div>
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
            Great Homes Start Here
          </h2>

          <p className="text-gray-500 mb-6">
            Register to book your first service
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

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
            <select className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
            </select>
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="bg-purple-950 text-white font-semibold py-3 rounded-xl hover:bg-purple-800 hover:scale-[1.02] transition duration-300 shadow-md"
            >
              Register
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
              onClick={() => window.location.href = "http://localhost:5000/auth/google"}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition font-semibold text-gray-700"
          >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
              Continue with Google
          </button>

          <p className="text-gray-500 text-center mt-6">
            Already a user?{" "}
            <Link
              to="/login"
              className="text-purple-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
        </div>
    </div>
    </div>
  )
}

export default Register
