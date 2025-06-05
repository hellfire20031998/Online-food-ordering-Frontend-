import { Card, Chip, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../State/Authentication/Action';
import { isPresentInFavorites } from '../config/logic';
const RestaurantCart = ({ item }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt")
    const  auth  = useSelector(store => store.auth)
   
    const favorites = auth.favorites

    // console.log("Restaurant favourites ",item)
    
    const isFavorite = isPresentInFavorites(favorites, item);
    
    const handleAddToFavourite = () => {
        dispatch(addToFavorite({ restaurantId: item.id, jwt }))
    }

    const handeNavigateTORestaurant=()=>{
        if(item.open){
            navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`)
        }
      }
    return (
        <Card  className='w-[18rem]' >
            <div className={`${true ? 'cursor-pointer' : "cursor-not-allowed"} relative`}>
                <img className='w-full h-[10rem] rounder-t-md object-cover'
                    src={item.images[0]} alt='' />

                <Chip
                    size='small'
                    className='absolute top-2 left-2'
                    color={item.open ? "success" : "error"}
                    label={item.open ? "Open" : "Closed"}
                />
            </div>

            <div className='p-4 textPart lg:flex w-full justify-between'>
                <div className='space-y-1'>
                    <p onClick={handeNavigateTORestaurant} className='font-semibold text-lg cursor-pointer'>{item.name}</p>
                    <p className='text-gray-500 text-sm'>
                        {item.description}
                    </p>
                </div>
            </div>

            <div>
                <IconButton onClick={handleAddToFavourite}>
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </div>
        </Card>
    )
}

export default RestaurantCart
