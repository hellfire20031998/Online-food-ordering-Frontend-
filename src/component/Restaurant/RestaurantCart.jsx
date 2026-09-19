import { Card, Chip, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../State/Authentication/Action';
import { isPresentInFavorites } from '../config/logic';
import { setPostLoginRedirect } from '../config/session';
import { secureUrl } from '../util/secureUrl';

/** Restaurant tile for the home grid. Fills its grid cell on every screen size. */
const RestaurantCart = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const favorites = useSelector(store => store.auth.favorites);

    const isFavorite = isPresentInFavorites(favorites, item);

    const handleAddToFavourite = (e) => {
        e.stopPropagation();
        if (!localStorage.getItem("jwt")) {
            // Favourites belong to an account: ask the visitor to sign in and come back here.
            setPostLoginRedirect(window.location.pathname);
            navigate("/account/login");
            return;
        }
        dispatch(addToFavorite({ restaurantId: item.id }))
    }

    const handleNavigateToRestaurant = () => {
        if (item.open) {
            navigate(`/restaurant/${item.address?.city || 'city'}/${item.name}/${item.id}`)
        }
    }

    return (
        <Card
            className={`w-full h-full flex flex-col ${item.open ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
            onClick={handleNavigateToRestaurant}
        >
            <div className='relative'>
                <img className='w-full h-40 sm:h-44 rounded-t-md object-cover'
                    src={secureUrl(item.images?.[0])} alt={item.name} />
                <Chip
                    size='small'
                    className='absolute top-2 left-2'
                    color={item.open ? "success" : "error"}
                    label={item.open ? "Open" : "Closed"}
                />
            </div>

            <div className='p-4 flex-1 flex flex-col gap-1'>
                <p className='font-semibold text-lg leading-tight'>{item.name}</p>
                {item.cuisineType && <p className='text-gray-400 text-xs uppercase tracking-wide'>{item.cuisineType}</p>}
                <p className='text-gray-500 text-sm line-clamp-2'>
                    {item.description}
                </p>
            </div>

            <div className='px-2 pb-2 flex items-center justify-between'>
                <span className='text-gray-500 text-sm px-2'>{item.address?.city}</span>
                <IconButton onClick={handleAddToFavourite} aria-label='Toggle favourite'>
                    {isFavorite ? <FavoriteIcon color='primary' /> : <FavoriteBorderIcon />}
                </IconButton>
            </div>
        </Card>
    )
}

export default RestaurantCart
