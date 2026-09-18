import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import CreateRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreateRestaurantForm';
import Admin from '../AdminComponent/Admin/Admin';
import { hasTokenAuthority } from '../component/config/session';
import { logout } from '../component/State/Authentication/Action';

export default function AdminRoute() {
  const usersRestaurant = useSelector(store => store.restaurant.usersRestaurant);
  const loading = useSelector(store => store.restaurant.loading);

  // The profile says ADMIN but the token was issued before approval: the API would answer 403.
  if (!hasTokenAuthority('ADMIN')) {
    return <SessionRefreshRequired />;
  }

  if (!usersRestaurant && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {!usersRestaurant ? (
        // Legacy owners without a restaurant: everything routes to the creation form.
        <Route path="/*" element={<CreateRestaurantForm />} />
      ) : (
        <Route path="/*" element={<Admin />} />
      )}
    </Routes>
  );
}

function SessionRefreshRequired() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInAgain = () => {
    dispatch(logout());
    navigate('/account/login');
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
      <Card variant="outlined" sx={{ maxWidth: 480 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Sign in again to continue</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your account was granted restaurant owner access after you signed in. Sign in again to refresh your session.
          </Typography>
          <Button variant="contained" onClick={signInAgain}>Sign in again</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
