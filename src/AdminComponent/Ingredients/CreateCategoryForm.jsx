import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { createIngredientCategory } from '../../component/State/Ingredients/Action';
import { useDispatch, useSelector } from 'react-redux';

export default function CreateIngredientCategoryForm() {
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: '',

  });
  const dispatch = useDispatch();
    const{restaurant} = useSelector(store=>store)
    const jwt = localStorage.getItem('jwt')

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    const data = {
        name: formData.name,
        restaurantId: restaurant.usersRestaurant.id
    }
    
    dispatch(createIngredientCategory({
        data,jwt
    }))
}
    
   
    console.log("category data form ", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='p-5'>
      <h1 className='text-gray-400 text-center text-xl pb-10'>Create Ingredient Category</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id='name'
          name='name'
          label="Food Category"
          variant='outlined'
          onChange={handleInputChange}
          value={formData.name}
          className='mb-4'
        />

        <Button className='pt-5' variant='contained' color='primary' type='submit'>
          Create Category
        </Button>
      </form>
    </div>
  );
}
