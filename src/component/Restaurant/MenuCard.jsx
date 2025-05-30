import React from 'react'
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


// const ingredients=[
//     {
//         category:"Nuts & Seeds",
//         ingredient:"Cashew"
//     },
//     {
//         category:"Protein",
//         ingredient:"protein"
//     },
//     {
//         category:"Protein",
//         ingredient:"Bacon Strips"
//     }
// ]

const demo = [
    {
        category: "Nuts & Seeds",
        ingredient: ["Cashew"]
    },
    {
        category: "Protein",
        ingredient: ["Ground beef", "Bacon strips"]
    }
]

const MenuCard = ({item}) => {
        // console.log("Items ", item)
    const handleCheckBoxChange =(value)=>{
        console.log("value")
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
                <form >
                <div className='flex gap-5 flex-wrap'>
        {
            Object.keys(CategorizeIngredients(item.ingredientsItems )).map((category) => (
                <div key={item.category}>
                    <p className='font-semibold mb-2'>{category}</p>
                    <FormGroup>
                        {CategorizeIngredients(item.ingredientsItems )[category].map((item) => (
                            <FormControlLabel
                                key={item.name}
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
                        <Button variant='contained' disabled={false} type='submit'>{true?"Add to Cart":"Out of Stock"}</Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>

    )
}

export default MenuCard
