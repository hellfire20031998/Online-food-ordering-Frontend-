import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../component/State/Authentication/Action';
import { canManagePlatform, isTeamAdmin, roleLabel } from '../component/config/roles';

export const DRAWER_WIDTH = 240;

const NAV = [
  { title: 'Overview', icon: <DashboardIcon />, path: '/team', exact: true },
  { title: 'Restaurants', icon: <StorefrontIcon />, path: '/team/restaurants' },
  { title: 'Applications', icon: <AssignmentIcon />, path: '/team/applications' },
  { title: 'Customers', icon: <PeopleIcon />, path: '/team/customers' },
  { title: 'Orders', icon: <ReceiptLongIcon />, path: '/team/orders' },
  { title: 'Refunds', icon: <CurrencyExchangeIcon />, path: '/team/refunds' },
  { title: 'Payouts', icon: <PaymentsIcon />, path: '/team/payouts', managerOnly: true },
  { title: 'Settings', icon: <SettingsIcon />, path: '/team/settings' },
  { title: 'Team', icon: <GroupsIcon />, path: '/team/members', adminOnly: true },
];

export default function TeamSideBar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(store => store.auth.user);

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const go = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const content = (
    <Box sx={{ width: DRAWER_WIDTH, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>Foodiyapa</Typography>
        <Typography variant="caption" color="text.secondary">Platform console</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {NAV.filter(item => (!item.adminOnly || isTeamAdmin(user?.role))
          && (!item.managerOnly || canManagePlatform(user?.role))).map(item => (
          <ListItemButton key={item.path} selected={isActive(item)} onClick={() => go(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" noWrap>{user?.fullName || user?.email}</Typography>
        <Typography variant="caption" color="text.secondary">{roleLabel(user?.role)}</Typography>
      </Box>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        {content}
      </Drawer>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
