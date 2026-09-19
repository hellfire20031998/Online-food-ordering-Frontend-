import React, { useMemo, useState } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Button, Checkbox, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { CategorizeIngredients } from '../util/CategorizeIngredients';
import { addItemToCart } from '../State/Cart/Action';
import { secureUrl } from '../util/secureUrl';

/** One dish on the restaurant page. `restaurant` is the restaurant being viewed. */
const MenuCard = ({ item, restaurant }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [conflict, setConflict] = useState(null); // { currentRestaurantName }
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState(null);
    const dispatch = useDispatch();

    const categorizedIngredients = useMemo(
        () => CategorizeIngredients(item.ingredientsItems || []),
        [item.ingredientsItems]
    );

    const handleCheckBoxChange = (ingredientName) => {
        setSelectedIngredients((current) =>
            current.includes(ingredientName)
                ? current.filter((name) => name !== ingredientName)
                : [...current, ingredientName]
        );
    };

    const add = async (replaceCart = false) => {
        setBusy(true);
        const result = await dispatch(addItemToCart({
            foodId: item.id,
            quantity: 1,
            ingredients: selectedIngredients,
            replaceCart,
            food: {
                id: item.id,
                name: item.name,
                price: item.price,
                images: item.images || [],
                restaurantId: restaurant?.id,
                restaurantName: restaurant?.name,
            },
        }));
        setBusy(false);
        setConflict(null);
        if (result?.success) {
            setToast({ severity: "success", text: `${item.name} added to your cart.` });
        } else if (result?.conflict) {
            setConflict({ currentRestaurantName: result.conflict.currentRestaurantName, message: result.conflict.message });
        } else {
            setToast({ severity: "error", text: result?.message || "Could not add to cart" });
        }
    };

    const handleAddItemToCart = (e) => {
        e.preventDefault();
        add(false);
    };

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`menu-item-${item.id}-content`}
                    id={`menu-item-${item.id}-header`}
                >
                    <div className='lg:flex items-center justify-between w-full'>
                        <div className='lg:flex items-center lg:gap-5'>
                            {item.images?.[0] && (
                                <img className='w-[7rem] h-[7rem] object-cover rounded' src={secureUrl(item.images[0])} alt='' />
                            )}
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
                            <Button variant='contained' type='submit' disabled={busy || item.available === false}>
                                {item.available === false ? "Unavailable" : "Add to cart"}
                            </Button>
                        </div>
                    </form>
                </AccordionDetails>
            </Accordion>

            <Dialog open={Boolean(conflict)} onClose={busy ? undefined : () => setConflict(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Replace your cart?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {conflict?.message || `Your cart has items from ${conflict?.currentRestaurantName}. A cart can hold one restaurant at a time.`}
                        {" "}Replace them with {item.name} from {restaurant?.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConflict(null)} disabled={busy}>Keep my cart</Button>
                    <Button onClick={() => add(true)} disabled={busy} variant="contained" color="warning">Replace</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast(null)}>
                {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.text}</Alert> : undefined}
            </Snackbar>
        </>
    );
};

export default MenuCard;
