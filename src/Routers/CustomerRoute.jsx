import React from 'react'
import NavBar from '../component/NavBar/NavBar'
import { Route, Routes } from 'react-router-dom'
import Cart from '../component/Cart/Cart'
import RestaurantDetails from '../component/Restaurant/RestaurantDetails'
import Profile from '../component/Profile/Profile'

const CustomerRoute = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/account/:register' element={<Home/>}/>
        <Route path='/restaurant/:city/:title/:id' element={<RestaurantDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/my-profile/*' element={<Profi le/>}/>
      </Routes>
    </div>
  )
}

export default CustomerRoute
