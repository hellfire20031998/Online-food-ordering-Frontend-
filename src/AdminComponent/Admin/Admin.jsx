import React, { useEffect, useState } from 'react'
import AdminSideBar, { ADMIN_DRAWER_WIDTH } from './AdminSideBar'
import { Route, Routes } from 'react-router-dom'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import RestaurantDashboard from '../Dashboard/Dashboard'
import Orders from '../Orders/Orders'
import Menu from '../Menu/Menu'
import FoodCategory from '../FoodCategory/FoodCategory'
import Ingredients from '../Ingredients/Ingredients'
import RestaurantDetails from './RestaurantDetails'
import CreateMenuForm from '../Menu/CreateMenuForm'
import OwnerPayouts from '../Payouts/Payouts'
import { useDispatch, useSelector } from 'react-redux'
import { getRestaurantsCategory } from '../../component/State/Restaurant/Action'
import { fetchRestaurantsOrder } from '../../component/State/Restaurant Order/Action'

/** Restaurant owner dashboard layout: side navigation plus routed pages. */
export default function Admin() {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const restaurant = useSelector(store => store.restaurant.usersRestaurant);
  const restaurantId = restaurant?.id;

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(getRestaurantsCategory({ restaurantId }));
    dispatch(fetchRestaurantsOrder({ restaurantId }));
  }, [dispatch, restaurantId]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSideBar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, ml: { lg: `${ADMIN_DRAWER_WIDTH}px` } }}>
        <AppBar position="sticky" color="default" elevation={0} sx={{ display: { lg: 'none' } }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }} noWrap>{restaurant?.name || 'Owner dashboard'}</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Routes>
            <Route path='/' element={<RestaurantDashboard />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/category' element={<FoodCategory />} />
            <Route path='/ingredients' element={<Ingredients />} />
            <Route path='/details' element={<RestaurantDetails />} />
            <Route path='/payouts' element={<OwnerPayouts />} />
            <Route path='/add-menu' element={<CreateMenuForm />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
