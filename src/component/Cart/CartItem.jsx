import { Chip, IconButton } from '@mui/material';
import React from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../State/Cart/Action';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleUpdateCartItem = (value) => {
    const newQuantity = item.quantity + value;

    if (newQuantity <= 0) {
      handleRemoveCartItem();
    } else {
      dispatch(updateCartItem({ cartItemId: item.id, quantity: newQuantity }));
    }
  };

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.id }));
  };

  return (
    <div className='px-5'>
      <div className='lg:flex items-center lg:space-x-5'>
        <div>
          <img className='w-[5rem] h-[5rem] object-cover' src={item.food?.images?.[0]} alt="" />
        </div>
        <div className='flex items-center justify-between lg:w-[70%]'>
          <div className='space-y-1 lg:space-y-3 w-full'>
            <p>{item.food?.name}</p>
            <div className='flex items-center space-x-1'>
              <IconButton onClick={() => handleUpdateCartItem(-1)}>
                <RemoveCircleOutline />
              </IconButton>
              <div className='w-5 h-5 text-xs flex items-center justify-center'>
                {item.quantity}
              </div>
              <IconButton onClick={() => handleUpdateCartItem(+1)}>
                <AddCircleOutline />
              </IconButton>
            </div>
          </div>
          <p>{Number(item.totalPrice ?? 0).toFixed(2)}</p>
        </div>
      </div>
      <div className='pt-3 space-x-2'>
        {item.ingredients?.map((ingredient) => (
          <Chip key={ingredient} label={ingredient} />
        ))}
      </div>
    </div>
  );
}

export default CartItem;
