import React, { useEffect } from 'react'
import AdminSideBar from './AdminSideBar'
import { Route, Routes } from 'react-router-dom'
import RestaurantDashboard from '../Dashboard/Dashboard'
import Orders from '../Orders/Orders'
import Menu from '../Menu/Menu'
import FoodCategory from '../FoodCategory/FoodCategory'
import Ingredients from '../Ingredients/Ingredients'
import RestaurantDetails from './RestaurantDetails'
import CreateMenuForm from '../Menu/CreateMenuForm'
import { useDispatch, useSelector } from 'react-redux'
import { getRestaurantsCategory } from '../../component/State/Restaurant/Action'
import { fetchRestaurantsOrder } from '../../component/State/Restaurant Order/Action'

export default function Admin() {
  const dispatch = useDispatch();
  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(getRestaurantsCategory({ restaurantId }));
    dispatch(fetchRestaurantsOrder({ restaurantId }));
  }, [dispatch, restaurantId]);

  return (
    <div>
      <div className='lg:flex justify-between'>
        <div>
          <AdminSideBar />
        </div>
        <div className='lg:w-[80%]'>
          <Routes>
            <Route path='/' element={<RestaurantDashboard />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/category' element={<FoodCategory />} />
            <Route path='/ingredients' element={<Ingredients />} />
            <Route path='/details' element={<RestaurantDetails />} />
            <Route path='/add-menu' element={<CreateMenuForm />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
