import { Drawer, useMediaQuery, Divider } from '@mui/material';
import React from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';

const menu = [
  { title: "Orders", icon: <ShoppingBagIcon />, path: "/my-profile/orders" },
  { title: "Favorites", icon: <FavoriteIcon />, path: "/my-profile/favorites" },
  { title: "Home", icon: <HomeIcon />, path: "/" },
  { title: "Logout", icon: <LogoutIcon />, path: "/" }
];

export const ProfileNavigation = ({ open, handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:620px)");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout())
      navigate('/')
    } else {
      navigate(item.path)
    }
    if (isSmallScreen && handleClose) {
      handleClose();
    }
  }

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      open={isSmallScreen ? open : true}
      onClose={handleClose}
      anchor="left"
      sx={{ zIndex: -1, position: 'sticky' }}
    >
      <div className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl gap-8 pt-16">
        {menu.map((item, index) => (
          <React.Fragment key={item.title}>
            <div onClick={() => handleNavigate(item)} className="px-5 flex items-center space-x-5 cursor-pointer rounded-md">
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
