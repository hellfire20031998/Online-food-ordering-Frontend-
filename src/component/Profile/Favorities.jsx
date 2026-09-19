import React from 'react'
import { useSelector } from 'react-redux'
import FavoriteRestaurantCart from '../Restaurant/FavoriteRestaurantCard'

const Favorities = () => {
  const favorites = useSelector(store => store.auth.favorites) || [];

  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorites</h1>
      <div className='flex flex-wrap gap-3 justify-center px-4'>
        {favorites.length === 0 && <p className='text-gray-400 py-10'>No favourites yet. Tap the heart on a restaurant to save it here.</p>}
        {favorites.map((item) => <FavoriteRestaurantCart key={item.id} item={item} />)}
      </div>
    </div>
  )
}

export default Favorities
