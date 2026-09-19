import { Dashboard, ShoppingBag } from '@mui/icons-material';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../component/State/Authentication/Action';

export const ADMIN_DRAWER_WIDTH = 240;

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "", exact: true },
  { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
  { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
  { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredient", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Payouts", icon: <PaymentsIcon />, path: "/payouts" },
];

/**
 * Restaurant owner navigation: permanent on large screens, a slide-in drawer on smaller ones
 * (opened from the bar in Admin).
 */
export default function AdminSideBar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const restaurant = useSelector(store => store.restaurant.usersRestaurant);

  const fullPath = (item) => `/admin/restaurant${item.path}`;
  const isActive = (item) => item.exact ? location.pathname === fullPath(item) : location.pathname.startsWith(fullPath(item));

  const go = (item) => {
    navigate(fullPath(item));
    onClose?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const content = (
    <Box sx={{ width: ADMIN_DRAWER_WIDTH, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={700} noWrap>{restaurant?.name || 'Restaurant'}</Typography>
        <Typography variant="caption" color="text.secondary">Owner dashboard</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {menu.map((item) => (
          <ListItemButton key={item.title} selected={isActive(item)} onClick={() => go(item)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );

  return (
    <>
      {/* Small screens */}
      <Drawer
        variant="temporary"
        open={Boolean(mobileOpen)}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        {content}
      </Drawer>
      {/* Large screens */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { width: ADMIN_DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
