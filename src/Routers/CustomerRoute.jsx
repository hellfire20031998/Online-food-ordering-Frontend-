import React from 'react'
import NavBar from '../component/NavBar/NavBar'
import { Route, Routes } from 'react-router-dom'
import Cart from '../component/Cart/Cart'
import RestaurantDetails from '../component/Restaurant/RestaurantDetails'
import Profile from '../component/Profile/Profile'
import UserProfile from '../component/Profile/UserProfile'
import Home from '../component/Home/Home'
import Auth from '../component/Auth/Auth'

const CustomerRoute = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/account/:register' element={<Home/>}/>
        <Route path='/restaurant/:city/:title/:id' element={<RestaurantDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/my-profile/*' element={<Profile/>}/>
        <Route path='/admin/restaurant/*' element={<Profile/>}/>
      </Routes>
      <Auth/>
    </div>
  )
}

export default CustomerRoute
