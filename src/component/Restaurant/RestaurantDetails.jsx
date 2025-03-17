import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';


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

const menu=[1,1,1,1,1,1,1]

const RestaurantDetails = () => {
    const [foodType, setFoodType] = useState("all")
    const handleFilter = (e) => {
        console.log(e.target.value, e.target.name)
    }
    return (
        <div className='px-5 lg: px-20'>
            <section>
                <h3 className='text-grey-500 py-2 mt-10'>Home/india/indian fast food/3</h3>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <img className='w-full h-[40vh] object-cover' src="https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.jpg?s=2048x2048&w=is&k=20&c=d7djnSC6-uLAjpdM8GPwAJP7sp2v1F4kU3f_0Bz0xDc=" alt="" />

                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img className='w-full h-[40vh] object-cover' src="https://media.istockphoto.com/id/1428412216/photo/a-male-chef-pouring-sauce-on-meal.jpg?s=612x612&w=0&k=20&c=8U3mrgWsuB7pB8axtGj89MXRkHDKodEli9F6wKgPT4A=" alt="" />

                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img className='w-full h-[40vh] object-cover' src="https://media.istockphoto.com/id/2063567291/photo/sri-lankan-curry-dish-with-vegetables-and-rice-at-negombo-restaurant-sri-lanka.jpg?s=2048x2048&w=is&k=20&c=pM1jMjX0TARalg6XdUIFt5kRDbR7A65LTzLWnyK-KuQ=" alt="" />

                        </Grid>



                    </Grid>
                </div>

                <div className='pt-3 pb-5'></div>
                <h1 className='text-4xl font-semibold'>Indian Fast Food</h1>
                <p className='text-gray-500 mt-1'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium pariatur sint placeat provident fuga, neque, velit harum in debitis distinctio aperiam aspernatur, aut sequi dolor repellendus modi! Placeat, assumenda.</p>
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
                                    {foodTypes.map((item) => <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />)}

                                </RadioGroup>
                            </FormControl>
                        </div>

                        <Divider />
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: "1rem" }}>
                                Food Category
                            </Typography>
                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup onChange={handleFilter} name='food_type' value={foodType}>
                                    {categories.map((item) => <FormControlLabel key={item} value={item} control={<Radio />} label={item} />)}

                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div
                    className='space-y-5 lg:w-[80%] lg:pl-10'>
                    {menu.map((item)=><MenuCard/>)}
                </div>

            </section>

        </div>
    )
}

export default RestaurantDetails
