import React, { useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PROFILE_MENU, ProfileNavigation } from './ProfileNavigation'
import UserProfile from './UserProfile'
import Orders from './Orders'
import Favorities from './Favorities'
import RefundAccount from './RefundAccount'

const Profile = () => {
  const [openSideBar, setOpenSideBar] = useState(false)
  const location = useLocation()
  const current = PROFILE_MENU.find((m) => (m.exact ? location.pathname === m.path : location.pathname.startsWith(m.path) && m.path !== '/'))

  return (
    <div className='lg:flex'>
      {/* Small screens: a bar with a menu button opens the navigation drawer */}
      <div className='lg:hidden flex items-center gap-2 px-2 py-2 border-b border-white/10'>
        <IconButton onClick={() => setOpenSideBar(true)} aria-label='Open profile menu'>
          <MenuIcon />
        </IconButton>
        <Typography variant='subtitle1' fontWeight={600}>{current?.title || 'My account'}</Typography>
      </div>

      <ProfileNavigation open={openSideBar} handleClose={() => setOpenSideBar(false)} />

      <div className='flex-1 min-w-0'>
        <Routes>
          <Route path='/' element={<UserProfile />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/favorites' element={<Favorities />} />
          <Route path='/refund-account' element={<RefundAccount />} />
        </Routes>
      </div>
    </div>
  )
}

export default Profile
