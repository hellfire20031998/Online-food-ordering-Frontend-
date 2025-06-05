import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient, createIngredientCategory } from '../../component/State/Ingredients/Action';

export default function CreateIngredientForm() {
    const [formData, setFormData] = useState({
        name: '',
        categoryId: ''
    });

    const dispatch = useDispatch();
       const{restaurant,ingredients} = useSelector((store)=>store)
       const jwt = localStorage.getItem('jwt')
       console.log("ingredients.category ",ingredients.category)

    const handleSubmit = (e) => {
        e.preventDefault(); // prevent page reload
        const data = {
            ...formData,
            restaurantId:
                restaurant.usersRestaurant.id
            
            
        };
        dispatch(createIngredient({data,jwt}))
        console.log("category data form ", data);
       
     };

     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='p-5'>
            <h1 className='text-gray-400 text-center text-xl pb-10'>Create Ingredient</h1>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    id='name'
                    name='name'
                    label="Name"
                    variant='outlined'
                    onChange={handleInputChange}
                    value={formData.name}
                    className='mb-4'
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Create Ingredient</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.ingredientCategoryId}
                        label="Category"
                        onChange={handleInputChange}
                        name='categoryId'
                    >
                       {ingredients.category?.map((item)=>{
                         return <MenuItem value={item.id}>{item.name}</MenuItem>
                       })}
                    </Select>
                </FormControl>

                <Button className='pt-5' variant='contained' color='primary' type='submit'>
                    Create Category
                </Button>
            </form>
        </div>
    );
}
