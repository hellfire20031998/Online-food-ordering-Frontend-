import { TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../../component/State/Restaurant/Action';

export default function CreateFoodCategoryForm() {
  const [formData, setFormData] = useState({
    categoryName: '',
    restaurantId: ''
  });
  const dispatch = useDispatch();

  const {restaurant} = useSelector(store=>store);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    const data = {
      name: formData.categoryName,
      restaurantId: {
        id: Number(formData.restaurantId) || 1, // fallback to 1 if empty
      }
    };
    dispatch(createCategory({reqData:data,jwt:localStorage.getItem('jwt')}))
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
      <h1 className='text-gray-400 text-center text-xl pb-10'>Create Category</h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id='categoryName'
          name='categoryName'
          label="Category"
          variant='outlined'
          onChange={handleInputChange}
          value={formData.categoryName}
          className='mb-4'
        />

        <Button className='pt-5' variant='contained' color='primary' type='submit'>
          Create Category
        </Button>
      </form>
    </div>
  );
}
