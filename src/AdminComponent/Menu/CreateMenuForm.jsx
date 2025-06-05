import { AddPhotoAlternate, Category, Close, Email } from '@mui/icons-material';
import { Box, Button, Chip, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { uploadImageToCloudinary } from '../util/CreateUploadToCloudinary';
import { useDispatch, useSelector } from 'react-redux';
import { createMenuItem } from '../../component/State/Menu/Action';

const initialValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    restaurantId: "",
    vegetarian: true,
    seasonal: false,
    ingredients: [],
    images: []
}

export default function CreateMenuForm() {
    const [uploadImage, setUplaodImage] = useState(false);
    const dispatch = useDispatch();
    const { restaurant, ingredients } = useSelector((store) => store)
    const jwt = localStorage.getItem('jwt')
    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            values.restaurantId=restaurant.usersRestaurant.id;
            dispatch(createMenuItem({menu:values,jwt}))
            console.log("values restaurant id ------", values)
        }

    });
    
    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        setUplaodImage(true)
        const image = await uploadImageToCloudinary(file)
        console.log("image-----", image)

        formik.setFieldValue("images", [...formik.values.images, image])
        setUplaodImage(false)
    }
    const handleRemoveImage = (index) => {
        const updatedImage = [...formik.values.images]
        updatedImage.splice(index, 1);
        formik.setFieldValue("images", updatedImage)
    }
   
    return (
        <div className='py-10 px-5 lg:flex items-center justify-center min-h-screen'>
            <div className='lg:max-w-4xl'>
                <h1 className='font-bold text-2xl text-center py-2'>
                    Add New Menu
                </h1>
                <form onSubmit={formik.handleSubmit} className='space-y-4'>
                    <Grid container spacing={2}>
                        <Grid className='flex flex-wrap gap-5' item xs={12}>
                            <input type='file'
                                accept='image/*'
                                id='fileInput'
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <label className='relative' htmlFor='fileInput'>
                                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                                    <AddPhotoAlternate className='text-white' />

                                </span>
                                {
                                    uploadImage && <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                                        <CircularProgress />
                                    </div>
                                }
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {formik.values.images.map((item, index) => <div className='relative' key={index}>
                                    <img className='w-24 h-24 object-cover' src={item} alt='' />
                                    <IconButton
                                        size='small'
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            outline: 'none'
                                        }}>
                                        <CloseIcon sx={{ fontSize: "1rem" }} onClick={() => handleRemoveImage(index)} />
                                    </IconButton>
                                </div>)}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth
                                id='name'
                                name='name'
                                label="Name"
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.name}>

                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth
                                id='description'
                                name='description'
                                label="Description"
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.description}>

                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField fullWidth
                                id='price'
                                name='price'
                                label="Price "
                                variant='outlined'
                                onChange={formik.handleChange}
                                value={formik.values.price}>

                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.category}
                                    label="Category"
                                    onChange={formik.handleChange}
                                    name='category'
                                >
                                    {restaurant.categories.map((item)=><MenuItem value={item}>{item.name}</MenuItem>)}
                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Ingredients</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    name='ingredients'
                                    multiple
                                    value={formik.values.ingredients}
                                    onChange={formik.handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Ingredients" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value.id} label={value.name} />
                                            ))}
                                        </Box>
                                    )}
                                //   MenuProps={MenuProps}
                                >
                                    {ingredients?.ingredients.map((item,index) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item}

                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Vegetarian</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.vegetarian}
                                    label="Vegetarian"
                                    onChange={formik.handleChange}
                                    name='vegetarian'
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Seasonal</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.seasonal}
                                    label="Seasonal"
                                    onChange={formik.handleChange}
                                    name='seasonal'
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <Button className='mt-4' variant='contained' color='primary' type='submit'>Create Menu</Button>
                </form>
            </div>

        </div>
    )
}
