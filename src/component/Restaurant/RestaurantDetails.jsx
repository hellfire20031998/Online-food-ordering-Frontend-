import { Alert, Button, CircularProgress, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { secureUrl } from '../util/secureUrl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../State/Menu/Action';

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

    const handleFilter = (e) => {
        setFoodType(e.target.value)
    }

    const handleFilterCategory = (e) => {
        setSelectedCategory(e.target.value)
    }

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

    return (
        <div className='px-5 lg:px-20'>
            <section>
                <h3 className='text-grey-500 py-2 mt-10'>
                    Home / {restaurant?.address?.city || "city"} / {restaurant?.name || "restaurant"}
                </h3>
                <div>
                    <Grid container spacing={2}>
                        {restaurant?.images?.map((imgUrl, index) => (
                            <Grid item xs={12} lg={index === 0 ? 12 : 6} key={imgUrl}>
                                <img className='w-full h-[40vh] object-cover' src={secureUrl(imgUrl)} alt={`restaurant-img-${index}`} />
                            </Grid>
                        ))}
                    </Grid>
                </div>

                <div className='pt-3 pb-5'></div>
                <h1 className='text-4xl font-semibold'>{restaurant?.name}</h1>
                <p className='text-gray-500 mt-1'>{restaurant?.description}</p>
                {restaurant?.address && (
                    <p className='text-gray-500 flex items-center gap-3'>
                        <LocationOnIcon />
                        <span>{restaurant.address.city}{restaurant.address.state ? `, ${restaurant.address.state}` : ""}</span>
                    </p>
                )}
                {restaurant?.openingHours && (
                    <p className='text-gray-500 flex items-center gap-3'>
                        <CalendarTodayIcon />
                        <span>{restaurant.openingHours}</span>
                    </p>
                )}
            </section>

            <Divider />

            <section className='pt-[2rem] lg:flex relative'>
                <div className='space-y-10 lg:w-[20%] filter'>
                    <div className='box space-y-5 lg:sticky top-28'>
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: "1rem" }}>
                                Food Type
                            </Typography>
                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup onChange={handleFilter} name='food_type' value={foodType}>
                                    {foodTypes.map((item) => (
                                        <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <Divider />
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: "1rem" }}>
                                Food Category
                            </Typography>
                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup onChange={handleFilterCategory} name='food_category' value={selectedCategory}>
                                    {categories.map((item) => (
                                        <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className='space-y-5 lg:w-[80%] lg:pl-10'>
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
