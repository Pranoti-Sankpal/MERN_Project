import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'

import Layout from './pages/owner/Layout'
import AddCar from './pages/owner/AddCar'
import ManageCar from './pages/owner/ManageCar'
import ManageBookings from './pages/owner/ManageBookings'
import Dashboard from './pages/owner/Dashboard'
import Login from './components/Login'


const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  return (
    <div>
      {showLogin && <Login setShowLogin={setShowLogin}/>}
    
      {/* Navbar */}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />

       <Route path="/owner" element={<Layout />}>

         <Route index element={<Dashboard />} />
         <Route path="add-car" element={<AddCar />} />
         <Route path="manage-cars" element={<ManageCar />} />
         <Route path="manage-bookings" element={<ManageBookings />} />

      </Route>
      </Routes>

      {/* Footer */}
      {!isOwnerPath && <Footer />}

    </div>
  )
}

export default App