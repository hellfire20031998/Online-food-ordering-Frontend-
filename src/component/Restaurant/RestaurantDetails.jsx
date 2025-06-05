import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../State/Menu/Action';


const categories = [
    "pizza",
    "briyani",
    "burger",
    "chicken",
    "rice"
]
const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetrian" },
    { label: "Seasonal", value: "seasonal" }
]

const menu = [1, 1, 1, 1, 1, 1, 1]

const RestaurantDetails = () => {
    const [foodType, setFoodType] = useState("all")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt")
    const { auth, restaurant, menu } = useSelector(store => store)
    // console.log("restaurant details ", restaurant.categories)

    const [selectedCategory, setSelectedCategory] = useState(null);

    const { id } = useParams();

    const handleFilter = (e) => {
        setFoodType(e.target.value)
        console.log( "foodType ",e.target.value, e.target.name)
    }

    const handleFilterCategory = (e, value) => {
        setSelectedCategory(e.target.value)
        console.log("handleFilterCategory ",e.target.value)
    }
    // console.log("restaurant id " , id)

    useEffect(() => {
        dispatch(getRestaurantById({ jwt, restaurantId: id }))
        dispatch(getRestaurantsCategory({ jwt, restaurantId: id }))

    }, [])

    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({ jwt, restaurantID: id, vegetarian: foodType === "vegetarian", nonveg: foodType === "non_vegetrian", seasonal: foodType === "seasonal", foodCategory: selectedCategory }))
    }, [selectedCategory, foodType])

    return (
        <div className='px-5 lg: px-20'>
            <section>
                <h3 className='text-grey-500 py-2 mt-10'>Home/india/indian fast food/3</h3>
                <div>

                    <Grid container spacing={2}>
                        {restaurant.restaurant?.images?.map((imgUrl, index) => (
                            <Grid item xs={12} lg={index === 0 ? 12 : 6} key={index}>
                                <img className='w-full h-[40vh] object-cover' src={imgUrl} alt={`restaurant-img-${index}`} />
                            </Grid>
                        ))}
                    </Grid>
                </div>

                <div className='pt-3 pb-5'></div>
                <h1 className='text-4xl font-semibold'>{restaurant.restaurant?.name}</h1>
                <p className='text-gray-500 mt-1'>{restaurant.restaurant?.description}</p>
                <p className='text-gray-500 flex items-center gap-3'>
                    <LocationOnIcon />
                    <span> Mumbai,Maharastra</span>
                </p>
                <p className='text-gray-500 flex items-center gap-3'>
                    <CalendarTodayIcon />
                    <span>Mon-Sun: 9:00 AM-9:00 PM </span>

                </p>
            </section>

            <Divider />

            <section className='pt-[2rem] lg:flex relative'>
                <div
                    className='space-y-10 lg:w-[20%] filter '>

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
                                    {restaurant.categories.map((item) => (
                                        <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                                    ))}
                                </RadioGroup>
                            </FormControl>

                        </div>
                    </div>
                </div>

                <div
                    className='space-y-5 lg:w-[80%] lg:pl-10'>
                    {menu.menuItems.map((item) => <MenuCard item={item} />)}
                </div>

            </section>

        </div>
    )
}

export default RestaurantDetails
