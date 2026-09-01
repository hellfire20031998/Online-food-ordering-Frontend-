import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { createIngredientCategory } from '../../component/State/Ingredients/Action';
import { useDispatch, useSelector } from 'react-redux';

export default function CreateIngredientCategoryForm() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantId || !name.trim()) return;
    const data = {
      name: name.trim(),
      restaurantId,
    }
    dispatch(createIngredientCategory({ data }))
    setName('');
  }

  return (
    <div className='p-5'>
      <h1 className='text-gray-400 text-center text-xl pb-10'>Create Ingredient Category</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id='name'
          name='name'
          label="Category Name"
          variant='outlined'
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='mb-4'
        />

        <Button className='pt-5' variant='contained' color='primary' type='submit'>
          Create Category
        </Button>
      </form>
    </div>
  );
}
