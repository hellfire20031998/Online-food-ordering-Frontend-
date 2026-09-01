import { Card, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../State/Authentication/Action';
import { isPresentInFavorites } from '../config/logic';

const FavoriteRestaurantCart = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const favorites = useSelector(store => store.auth.favorites);

    const isFavorite = isPresentInFavorites(favorites, item);

    const handleAddToFavourite = () => {
        dispatch(addToFavorite({ restaurantId: item.id }))
    }

    const handleNavigateToRestaurant = () => {
        if (item.open) {
            navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`)
        }
    }

    return (
        <Card className='w-[18rem]'>
            <div className={`${item.open ? 'cursor-pointer' : 'cursor-not-allowed'} relative`}>
                <img className='w-full h-[10rem] rounded-t-md object-cover'
                    src={item.images} alt='' />
            </div>

            <div className='p-4 textPart lg:flex w-full justify-between'>
                <div className='space-y-1'>
                    <p onClick={handleNavigateToRestaurant} className='font-semibold text-lg cursor-pointer'>{item.title}</p>
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

export default FavoriteRestaurantCart
