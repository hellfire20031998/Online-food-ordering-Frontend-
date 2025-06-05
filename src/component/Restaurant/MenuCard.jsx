import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Category } from '@mui/icons-material';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { CategorizeIngredients } from '../util/CategorizeIngredients';
import CartItem from '../Cart/CartItem';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../State/Cart/Action';


const MenuCard = ({item}) => {
    const[selectedIngredients,setSelectedIngredients]= useState([])
    const dispatch= useDispatch();
        // console.log("Items ", item)
    const handleCheckBoxChange =(itemName)=>{
        console.log("value ", itemName)
        if(selectedIngredients.includes(itemName)){
            setSelectedIngredients(selectedIngredients.filter((item)=>item!==itemName))
        }else{
            setSelectedIngredients([...selectedIngredients,itemName])
        }
    }

    const handleAddItemTOCart=(e)=>{
        e.preventDefault();
        const items = selectedIngredients.map(item => item.name); // example
        const reqData=   {
            token:localStorage.getItem("jwt"),
        cartItem:{
            foodId:item.id,
            quantity:1,
            ingredients:items
        }
        }
        dispatch(addItemToCart(reqData))
       
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div className='lg:flex items-center justify-between'>
                    <div className='lg:flex items-center lg:gap-5'>
                        <img className='w-[7rem] h-[7rem] object-cover' src={item.images[0]} alt="" />
                        <div className='space-y-1 lg:space-y-5 lg:az-w-2xl'>
                            <p className='font=semibold text=xl'>{item.name}</p>
                            <p>{item.price}</p>
                            <p className='text-gray-400'>{item.description}</p>
                        </div>




                    </div>

                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleAddItemTOCart} >
                <div className='flex gap-5 flex-wrap'>
        {
            Object.keys(CategorizeIngredients(item.ingredientsItems )).map((category) => (
                <div key={item.category}>
                    <p className='font-semibold mb-2'>{category}</p>
                    <FormGroup>
                        {CategorizeIngredients(item.ingredientsItems )[category].map((item) => (
                            <FormControlLabel
                                key={item.id}
                                control={<Checkbox onChange={() => handleCheckBoxChange(item)} />}
                                label={item.name}
                            />
                        ))}
                    </FormGroup>
                </div>
            ))
        }
    </div>
                    <div className='pt-5'>
                        <Button  variant='contained' disabled={false} type='submit'>{true?"Add to Cart":"Out of Stock"}</Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>

    )
}

export default MenuCard
