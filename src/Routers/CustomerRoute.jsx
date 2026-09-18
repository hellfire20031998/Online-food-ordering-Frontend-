import React from 'react'
import NavBar from '../component/NavBar/NavBar'
import { Route, Routes } from 'react-router-dom'
import Cart from '../component/Cart/Cart'
import RestaurantDetails from '../component/Restaurant/RestaurantDetails'
import Profile from '../component/Profile/Profile'
import Home from '../component/Home/Home'
import Auth from '../component/Auth/Auth'
import ProtectedRoute from './ProtectedRoute'
import PartnerApplication from '../component/Partner/PartnerApplication'
import GuestCartMerge from '../component/Cart/GuestCartMerge'

const CustomerRoute = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/account/:register' element={<Home />} />
        <Route path='/restaurant/:city/:title/:id' element={<RestaurantDetails />} />
        {/* Visitors can view and edit their cart; signing in is asked for at checkout. */}
        <Route path='/cart' element={<Cart />} />
        <Route
          path='/my-profile/*'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/partner'
          element={
            <ProtectedRoute>
              <PartnerApplication />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Auth />
      <GuestCartMerge />
    </div>
  )
}

export default CustomerRoute
