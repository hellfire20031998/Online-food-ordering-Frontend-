import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeamSideBar, { DRAWER_WIDTH } from './TeamSideBar';
import Overview from './Overview/Overview';
import Restaurants from './Restaurants/Restaurants';
import RestaurantDetail from './Restaurants/RestaurantDetail';
import Applications from './Applications/Applications';
import Customers from './Customers/Customers';
import CustomerDetail from './Customers/CustomerDetail';
import Orders from './Orders/Orders';
import Members from './Members/Members';
import Settings from './Settings/Settings';
import Refunds from './Refunds/Refunds';
import Payouts from './Payouts/Payouts';
import { canManagePlatform, isTeamAdmin } from '../component/config/roles';

/** Layout + routes for the platform team console (/team/*). */
export default function TeamRoute() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector(store => store.auth.user);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TeamSideBar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, ml: { lg: `${DRAWER_WIDTH}px` } }}>
        <AppBar position="sticky" color="default" elevation={0} sx={{ display: { lg: 'none' } }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="open navigation">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>Platform console</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route
              path="/payouts"
              element={canManagePlatform(user?.role) ? <Payouts /> : <Navigate to="/team" replace />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/members"
              element={isTeamAdmin(user?.role) ? <Members /> : <Navigate to="/team" replace />}
            />
            <Route path="*" element={<Navigate to="/team" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
