import { Drawer, Divider, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';

export const PROFILE_MENU = [
  { title: "Profile", icon: <PersonIcon />, path: "/my-profile", exact: true },
  { title: "Orders", icon: <ShoppingBagIcon />, path: "/my-profile/orders" },
  { title: "Favorites", icon: <FavoriteIcon />, path: "/my-profile/favorites" },
  { title: "Refund account", icon: <AccountBalanceIcon />, path: "/my-profile/refund-account" },
  { title: "Home", icon: <HomeIcon />, path: "/" },
];

/**
 * Profile section navigation: a permanent side column on large screens, a slide-in drawer on
 * smaller ones (opened from the bar in Profile).
 */
export const ProfileNavigation = ({ open, handleClose }) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/';

  const go = (path) => {
    navigate(path);
    handleClose?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const content = (
    <List sx={{ width: 260, pt: 2 }}>
      {PROFILE_MENU.map((item) => (
        <ListItemButton key={item.title} selected={isActive(item)} onClick={() => go(item.path)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

  if (isLarge) {
    return <aside className='w-[260px] flex-none border-r border-white/10 min-h-[80vh]'>{content}</aside>;
  }

  return (
    <Drawer anchor="left" open={Boolean(open)} onClose={handleClose} ModalProps={{ keepMounted: true }}>
      {content}
    </Drawer>
  );
};
