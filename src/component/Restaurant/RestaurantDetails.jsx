import { Alert, Button, Chip, CircularProgress, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../State/Menu/Action';
import { secureUrl } from '../util/secureUrl';

const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetarian" },
    { label: "Seasonal", value: "seasonal" }
]

const RestaurantDetails = () => {
    const [foodType, setFoodType] = useState("all")
    const [selectedCategory, setSelectedCategory] = useState("");
    const dispatch = useDispatch();
    const restaurant = useSelector(store => store.restaurant.restaurant)
    const categories = useSelector(store => store.restaurant.categories)
    const menuItems = useSelector(store => store.menu.menuItems)
    const menuLoading = useSelector(store => store.menu.loading)
    const menuError = useSelector(store => store.menu.error)

    const { id } = useParams();

    useEffect(() => {
        dispatch(getRestaurantById(id))
        dispatch(getRestaurantsCategory({ restaurantId: id }))
    }, [dispatch, id])

    const loadMenu = useCallback(() => {
        dispatch(getMenuItemsByRestaurantId({
            restaurantId: id,
            vegetarian: foodType === "vegetarian",
            nonVegetarian: foodType === "non_vegetarian",
            seasonal: foodType === "seasonal",
            foodCategory: selectedCategory,
        }))
    }, [dispatch, id, selectedCategory, foodType])

    useEffect(() => {
        loadMenu()
    }, [loadMenu])

    const images = restaurant?.images || [];

    return (
        <div className='px-4 sm:px-8 lg:px-20'>
            <section>
                <h3 className='text-gray-500 text-sm py-2 mt-4 lg:mt-8'>
                    Home / {restaurant?.address?.city || "city"} / {restaurant?.name || "restaurant"}
                </h3>

                {/* Photos: swipeable strip on phones, two-column gallery on large screens */}
                {images.length > 0 && (
                    <div className='flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible'>
                        {images.map((imgUrl, index) => (
                            <img
                                key={imgUrl}
                                className={`h-52 sm:h-64 lg:h-[40vh] w-[85%] sm:w-[70%] lg:w-full flex-none snap-center object-cover rounded-lg ${index === 0 ? 'lg:col-span-2' : ''}`}
                                src={secureUrl(imgUrl)}
                                alt={`${restaurant?.name || 'Restaurant'} ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold pt-4'>{restaurant?.name}</h1>
                <p className='text-gray-400 mt-1'>{restaurant?.description}</p>
                <div className='flex flex-wrap gap-x-6 gap-y-1 text-gray-400 text-sm mt-2'>
                    {restaurant?.address && (
                        <span className='flex items-center gap-2'>
                            <LocationOnIcon fontSize='small' />
                            {restaurant.address.city}{restaurant.address.state ? `, ${restaurant.address.state}` : ""}
                        </span>
                    )}
                    {restaurant?.openingHours && (
                        <span className='flex items-center gap-2'>
                            <CalendarTodayIcon fontSize='small' />
                            {restaurant.openingHours}
                        </span>
                    )}
                </div>
            </section>

            <Divider sx={{ my: 3 }} />

            {/* Filters: chip rows on small screens, sidebar on large */}
            <section className='lg:hidden space-y-3 mb-4'>
                <div className='flex gap-2 overflow-x-auto pb-1'>
                    {foodTypes.map((item) => (
                        <Chip
                            key={item.value}
                            label={item.label}
                            color={foodType === item.value ? 'primary' : 'default'}
                            variant={foodType === item.value ? 'filled' : 'outlined'}
                            onClick={() => setFoodType(item.value)}
                        />
                    ))}
                </div>
                {categories.length > 0 && (
                    <div className='flex gap-2 overflow-x-auto pb-1'>
                        <Chip
                            label='All categories'
                            color={selectedCategory === '' ? 'primary' : 'default'}
                            variant={selectedCategory === '' ? 'filled' : 'outlined'}
                            onClick={() => setSelectedCategory('')}
                        />
                        {categories.map((item) => (
                            <Chip
                                key={item.id}
                                label={item.name}
                                color={selectedCategory === item.name ? 'primary' : 'default'}
                                variant={selectedCategory === item.name ? 'filled' : 'outlined'}
                                onClick={() => setSelectedCategory(item.name)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className='lg:flex lg:gap-10 relative pb-10'>
                <aside className='hidden lg:block lg:w-[22%]'>
                    <div className='space-y-6 lg:sticky lg:top-24'>
                        <div>
                            <Typography variant='h6' sx={{ pb: 1 }}>Food Type</Typography>
                            <FormControl component='fieldset'>
                                <RadioGroup onChange={(e) => setFoodType(e.target.value)} name='food_type' value={foodType}>
                                    {foodTypes.map((item) => (
                                        <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Divider />
                        <div>
                            <Typography variant='h6' sx={{ pb: 1 }}>Food Category</Typography>
                            <FormControl component='fieldset'>
                                <RadioGroup onChange={(e) => setSelectedCategory(e.target.value)} name='food_category' value={selectedCategory}>
                                    <FormControlLabel value='' control={<Radio />} label='All' />
                                    {categories.map((item) => (
                                        <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </aside>

                <div className='space-y-4 lg:w-[78%]'>
                    {menuLoading && menuItems.length === 0 && (
                        <div className='flex items-center gap-3 text-gray-400 py-10'>
                            <CircularProgress size={22} />
                            <span>Loading menu…</span>
                        </div>
                    )}
                    {menuError && (
                        <Alert
                            severity='error'
                            action={<Button color='inherit' size='small' onClick={loadMenu}>Retry</Button>}
                        >
                            {menuError}
                        </Alert>
                    )}
                    {!menuLoading && !menuError && menuItems.length === 0 && (
                        <Typography color='text.secondary' sx={{ py: 6 }}>
                            {foodType !== 'all' || selectedCategory
                                ? 'No dishes match these filters. Try "All" or another category.'
                                : 'This restaurant has not added any dishes yet.'}
                        </Typography>
                    )}
                    {menuItems.map((item) => <MenuCard key={item.id} item={item} restaurant={restaurant} />)}
                </div>
            </section>
        </div>
    )
}

export default RestaurantDetails
