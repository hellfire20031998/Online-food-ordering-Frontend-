import React, { useState } from 'react'
import { ProfileNavigation } from './ProfileNavigation'
import { Route, Routes } from 'react-router-dom'
import UserProfile from './UserProfile'
import Orders from './Orders'
import Favorities from './Favorities'
import RefundAccount from './RefundAccount'

const Profile = () => {
  const [openSideBar, setOpenSideBar] = useState(false)
  return (
    <div className='lg:flex justify-between'>
        <div className='sticky h-[80vh] lg:w-[20%]'>
          <ProfileNavigation open={openSideBar} handleClose={() => setOpenSideBar(false)}/>
        </div>
        <div className='lg:w-[80%]'>
          <Routes>
            <Route path='/' element={<UserProfile/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/favorites' element={<Favorities/>}/>
            <Route path='/refund-account' element={<RefundAccount/>}/>
          </Routes>
        </div>
    </div>
  )
}

export default Profile
