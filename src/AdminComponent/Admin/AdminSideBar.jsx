import { Dashboard, Logout, ShoppingBag } from '@mui/icons-material';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventIcon from '@mui/icons-material/Event';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../component/State/Authentication/Action';

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
  { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
  { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredient", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Events", icon: <EventIcon />, path: "/event" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Logout", icon: <LogoutIcon />, path: "/" },
];

export default function AdminSideBar({ handleClose }) {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch= useDispatch();

  const handleNavigation = (item) => {
    console.log("navigete path ",item)
    if(item.title==='Logout'){
      
        navigate('/')
        handleClose();
        dispatch(logout(null))
    }
    else{
      navigate(`/admin/restaurant${item.path}`)
    }
    if (isSmallScreen && handleClose) {
      handleClose(); // Close drawer on mobile
    }
  };

  return (
    <Drawer
      variant={isSmallScreen ? 'temporary' : 'permanent'}
      onClose={handleClose}
      open={true}
      anchor="left"
      sx={{ zIndex: 1 }}
    >
      <div className="w-[70vw] lg:w-[20vw] h-screen flex flex-col text-xl overflow-auto p-4 space-y-[1.65rem]">
      {menu.map((item, index) => (
  <React.Fragment key={index}>
    <div
      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-all gap-5"
      onClick={() => handleNavigation(item)}
    >
      {item.icon}
      <span>{item.title}</span>
    </div>
    {index !== menu.length - 1 && <Divider />}
  </React.Fragment>
))}

        
      </div>
    </Drawer>
  );
}
