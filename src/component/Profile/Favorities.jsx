import React from 'react'
import RestaurantCart from '../Restaurant/RestaurantCart'
import { useSelector } from 'react-redux'

const Favorities = () => {
  const auth= useSelector(store=>store.auth)
  const favorites = auth?.user?.favorites || []
  console.log("auth ", auth)
  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorities</h1>
      <div className='flex flex-wrap gap-3 justify-center'>
        {favorites.map((item)=><RestaurantCart item={item}/>)}

      </div>
    </div>
  )
}

export default Favorities
