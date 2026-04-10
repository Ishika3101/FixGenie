import React from 'react'
import CustomerDashboard from "../components/CustomerDashboard"
import ProviderDashboard from "../components/ProviderDashboard"
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const{user}=useAuth()

  return (
    <div>
      {user.role==='customer' ? (
        <CustomerDashboard />
      ):(
        <ProviderDashboard />
      )}
    </div>
  )
}

export default Dashboard
