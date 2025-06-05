import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN_REQUEST, LOGOUT } from '../State/Authentication/ActionTypes';
import { logout } from '../State/Authentication/Action';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {auth} = useSelector(store=>store);
  const handleLogOut=()=>{
      localStorage.clear();
      dispatch(logout(null))
      navigate('/')
      
      
  }
  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center text-center'>

      <div className='flex flex-col items-center justify-center'>
      <AccountCircleIcon sx={{fontSize:"9rem"}}/> 
      <h1 className='py-5 text-2xl font-semibold'>Code with zosh</h1>
      <p>Email: {auth.user?.email}</p>
      <Button variant="contained" onClick={handleLogOut} sx={{margin:"2rem 0rem"}}>LogOut</Button>
      </div>
     
    </div>
  )
}

export default UserProfile
