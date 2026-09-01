import React from 'react'
import { useSelector } from 'react-redux'
import FavoriteRestaurantCart from '../Restaurant/FavoriteRestaurantCard'

const Favorities = () => {
  const favorites = useSelector(store => store.auth.favorites) || [];

  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorites</h1>
      <div className='flex flex-wrap gap-3 justify-center'>
        {favorites.map((item) => <FavoriteRestaurantCart key={item.id} item={item} />)}
      </div>
    </div>
  )
}

export default Favorities
