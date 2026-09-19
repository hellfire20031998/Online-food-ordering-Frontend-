import { Chip, IconButton } from '@mui/material';
import React from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../State/Cart/Action';
import { secureUrl } from '../util/secureUrl';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleUpdateCartItem = (value) => {
    const newQuantity = item.quantity + value;
    if (newQuantity <= 0) {
      dispatch(removeCartItem({ cartItemId: item.id }));
    } else {
      dispatch(updateCartItem({ cartItemId: item.id, quantity: newQuantity }));
    }
  };

  const image = item.food?.images?.[0];

  return (
    <div className='px-4 sm:px-5'>
      <div className='flex items-center gap-3 sm:gap-4'>
        {image && (
          <img className='w-16 h-16 sm:w-20 sm:h-20 flex-none rounded object-cover' src={secureUrl(image)} alt='' />
        )}
        <div className='flex-1 min-w-0'>
          <p className='font-medium truncate'>{item.food?.name}</p>
          <div className='flex items-center -ml-2'>
            <IconButton size='small' onClick={() => handleUpdateCartItem(-1)} aria-label='Decrease quantity'>
              <RemoveCircleOutline fontSize='small' />
            </IconButton>
            <span className='w-6 text-center text-sm'>{item.quantity}</span>
            <IconButton size='small' onClick={() => handleUpdateCartItem(+1)} aria-label='Increase quantity'>
              <AddCircleOutline fontSize='small' />
            </IconButton>
          </div>
        </div>
        <p className='font-medium whitespace-nowrap'>₹{Number(item.totalPrice ?? 0).toFixed(2)}</p>
      </div>
      {item.ingredients?.length > 0 && (
        <div className='pt-2 flex flex-wrap gap-1'>
          {item.ingredients.map((ingredient) => (
            <Chip key={ingredient} label={ingredient} size='small' />
          ))}
        </div>
      )}
    </div>
  );
}

export default CartItem;
