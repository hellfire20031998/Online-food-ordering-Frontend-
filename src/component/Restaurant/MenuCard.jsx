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

const MenuCard = () => {
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
                        <img className='w-[7rem] h-[7rem] object-cover' src="https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                        <div className='space-y-1 lg:space-y-5 lg:az-w-2xl'>
                            <p className='font=semibold text=xl'>Burget</p>
                            <p>₹499</p>
                            <p className='text-gray-400'>Nice Burger</p>
                        </div>




                    </div>

                </div>
            </AccordionSummary>
            <AccordionDetails>
                <form >
                    <div className='flex gap-5 flex-wrap'   >
                        {
                            demo.map((item) =>
                                <div>
                                    <p>{item.category}</p>
                                    <FormGroup>
                                        {
                                            item.ingredient.map((item) => <FormControlLabel control={<Checkbox onChange={()=>handleCheckBoxChange(item)}/>} label={item} />)
                                        }
                                    </FormGroup>
                                </div>
                            )
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
