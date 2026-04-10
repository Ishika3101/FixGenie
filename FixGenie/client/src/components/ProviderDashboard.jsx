import React from 'react'
import { useAuth } from '../context/AuthContext'

const ProviderDashboard = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-10">

            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-purple-950">
                    Welcome, {user.name}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's your service overview for today
                </p>
            </div>

            {/* ADD THIS PART - Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Total Requests", value: "0", color: "bg-purple-100 text-purple-700" },
                    { label: "Pending", value: "0", color: "bg-yellow-100 text-yellow-700" },
                    { label: "Completed", value: "0", color: "bg-green-100 text-green-700" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${stat.color}`}>
                            {stat.label}
                        </div>
                        <p className="text-4xl font-bold text-purple-950">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* ADD THIS PART - Incoming Requests */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-purple-950 mb-4">
                    Incoming Booking Requests
                </h2>
                <p className="text-gray-400">No requests yet.</p>
            </div>

        </div>
    )
}

export default ProviderDashboard