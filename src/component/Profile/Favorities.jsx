import React from 'react'
import RestaurantCart from '../Restaurant/RestaurantCart'
import { useSelector } from 'react-redux'
import FavoriteRestaurantCart from '../Restaurant/FavoriteRestaurantCard'

const Favorities = () => {
  const auth= useSelector(store=>store.auth)
  const favorites = auth.favorites || [];

  console.log("auth favourites", auth)
  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorities</h1>
      <div className='flex flex-wrap gap-3 justify-center'>
        {auth.favorites?.map((item)=><FavoriteRestaurantCart item={item} />)}

      </div>
    </div>
  )
}

export default Favorities
