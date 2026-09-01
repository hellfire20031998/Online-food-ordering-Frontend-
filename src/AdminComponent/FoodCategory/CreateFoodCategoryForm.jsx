import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../../component/State/Restaurant/Action';

export default function CreateFoodCategoryForm() {
  const [categoryName, setCategoryName] = useState('');
  const dispatch = useDispatch();
  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantId || !categoryName.trim()) return;
    const data = {
      name: categoryName.trim(),
      restaurantId: { id: restaurantId },
    };
    dispatch(createCategory(data));
    setCategoryName('');
  };

  return (
    <div className='p-5'>
      <h1 className='text-gray-400 text-center text-xl pb-10'>Create Category</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id='categoryName'
          name='categoryName'
          label="Category"
          variant='outlined'
          onChange={(e) => setCategoryName(e.target.value)}
          value={categoryName}
          className='mb-4'
        />

        <Button className='pt-5' variant='contained' color='primary' type='submit'>
          Create Category
        </Button>
      </form>
    </div>
  );
}
