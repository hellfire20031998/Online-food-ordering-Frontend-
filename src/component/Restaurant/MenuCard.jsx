import React, { useMemo, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { CategorizeIngredients } from '../util/CategorizeIngredients';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../State/Cart/Action';

const MenuCard = ({ item }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const dispatch = useDispatch();

    const categorizedIngredients = useMemo(
        () => CategorizeIngredients(item.ingredientsItems || []),
        [item.ingredientsItems]
    );

    const handleCheckBoxChange = (ingredientName) => {
        if (selectedIngredients.includes(ingredientName)) {
            setSelectedIngredients(selectedIngredients.filter((name) => name !== ingredientName))
        } else {
            setSelectedIngredients([...selectedIngredients, ingredientName])
        }
    }

    const handleAddItemToCart = (e) => {
        e.preventDefault();
        dispatch(addItemToCart({
            foodId: item.id,
            quantity: 1,
            ingredients: selectedIngredients,
        }))
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`menu-item-${item.id}-content`}
                id={`menu-item-${item.id}-header`}
            >
                <div className='lg:flex items-center justify-between'>
                    <div className='lg:flex items-center lg:gap-5'>
                        <img className='w-[7rem] h-[7rem] object-cover' src={item.images?.[0]} alt="" />
                        <div className='space-y-1 lg:space-y-5 lg:max-w-2xl'>
                            <p className='font-semibold text-xl'>{item.name}</p>
                            <p>₹{Number(item.price ?? 0).toFixed(2)}</p>
                            <p className='text-gray-400'>{item.description}</p>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleAddItemToCart}>
                    <div className='flex gap-5 flex-wrap'>
                        {Object.keys(categorizedIngredients).map((category) => (
                            <div key={category}>
                                <p className='font-semibold mb-2'>{category}</p>
                                <FormGroup>
                                    {categorizedIngredients[category].map((ingredient) => (
                                        <FormControlLabel
                                            key={ingredient.id}
                                            control={
                                                <Checkbox
                                                    checked={selectedIngredients.includes(ingredient.name)}
                                                    onChange={() => handleCheckBoxChange(ingredient.name)}
                                                />
                                            }
                                            label={ingredient.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                        ))}
                    </div>
                    <div className='pt-5'>
                        <Button variant='contained' disabled={!item.available} type='submit'>
                            {item.available ? "Add to Cart" : "Out of Stock"}
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    )
}

export default MenuCard
