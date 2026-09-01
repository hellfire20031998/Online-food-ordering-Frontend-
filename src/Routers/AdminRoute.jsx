import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import CreateRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreateRestaurantForm';
import Admin from '../AdminComponent/Admin/Admin';

export default function AdminRoute() {
  const usersRestaurant = useSelector(store => store.restaurant.usersRestaurant);
  const loading = useSelector(store => store.restaurant.loading);

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
        // No restaurant yet: everything routes to the creation form.
        <Route path="/*" element={<CreateRestaurantForm />} />
      ) : (
        <Route path="/*" element={<Admin />} />
      )}
    </Routes>
  );
}
