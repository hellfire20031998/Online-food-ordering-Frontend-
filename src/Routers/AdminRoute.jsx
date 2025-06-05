import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CreateRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreateRestaurantForm';
import Admin from '../AdminComponent/Admin/Admin';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { restaurant } = useSelector(store => store);

  // console.log("restaurant routes ", restaurant)

  return (
    <Routes>
      {!restaurant.usersRestaurant ? (
        // Redirect everything to restaurant creation if no restaurant exists
        <Route path="/*" element={<CreateRestaurantForm />} />
      ) : (
        // Nested admin routes go here
        <Route path="/*" element={<Admin />} />
      )}
    </Routes>
  );
}
