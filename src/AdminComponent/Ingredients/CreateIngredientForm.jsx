import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../component/State/Ingredients/Action';

export default function CreateIngredientForm() {
    const [formData, setFormData] = useState({
        name: '',
        categoryId: ''
    });

    const dispatch = useDispatch();
    const restaurantId = useSelector((store) => store.restaurant.usersRestaurant?.id);
    const categories = useSelector((store) => store.ingredients.category);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!restaurantId || !formData.name.trim() || !formData.categoryId) return;
        const data = {
            ...formData,
            name: formData.name.trim(),
            restaurantId,
        };
        dispatch(createIngredient({ data }))
        setFormData({ name: '', categoryId: '' });
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
                    <InputLabel id="ingredient-category-select-label">Category</InputLabel>
                    <Select
                        labelId="ingredient-category-select-label"
                        id="ingredient-category-select"
                        value={formData.categoryId}
                        label="Category"
                        onChange={handleInputChange}
                        name='categoryId'
                    >
                        {categories?.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button className='pt-5' variant='contained' color='primary' type='submit'>
                    Create Ingredient
                </Button>
            </form>
        </div>
    );
}
