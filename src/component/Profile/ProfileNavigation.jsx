import { Drawer, useMediaQuery, Divider } from '@mui/material';
import React from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';

const menu = [
  { title: "Orders", icon: <ShoppingBagIcon /> },
  { title: "Favorites", icon: <FavoriteIcon /> },
  { title: "Home", icon: <HomeIcon /> },
  { title: "Payments", icon: <AccountBalanceWalletIcon /> },
  { title: "Notification", icon: <NotificationsActiveIcon /> },
  { title: "Events", icon: <EventIcon /> },
  { title: "Logout", icon: <LogoutIcon /> }
];

export const ProfileNavigation = ({ open, handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1024px)");

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleNavigate=(item)=>{
    if(item.title==="Logout"){
      dispatch(logout())
      navigate('/')
    }else
    navigate(`/my-profile/${item.title.toLowerCase()}`)

  }

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      open={isSmallScreen ? open : true}
      onClose={handleClose} // Only closeable in mobile view
      anchor="left"
      sx={{
       zIndex:-1,position:'sticky'
      }}
    >
      <div  className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl gap-8 pt-16">
        {menu.map((item, index) => (
          <React.Fragment key={index}>
            <div onClick={()=>handleNavigate(item)} className="px-5 flex items-center space-x-5 cursor-pointer rounded-md">
              {item.icon}
              <span>{item.title}</span>
            </div>
            {index !== menu.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </Drawer>
  );
};
