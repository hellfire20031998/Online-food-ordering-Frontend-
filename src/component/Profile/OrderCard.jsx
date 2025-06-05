import { Button, Card } from '@mui/material';
import React from 'react';

const OrderCard = ({ item, order, onCancel, onChangePaymentMethod }) => {
  const isCancelable = order.orderStatus === 'PENDING' || order.orderStatus === 'PLACED';
  const canChangePayment = isCancelable;

  const handleCancel = () => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel(order.id);
    }
  };

  const handleChangePayment = () => {
    if (onChangePaymentMethod && typeof onChangePaymentMethod === 'function') {
      onChangePaymentMethod(order.id);
    }
  };

  return (
    <Card className="flex justify-between items-center p-5 flex-wrap gap-4">
      <div className="flex items-center space-x-5">
        <img className="h-16 w-16" src={item.food?.images[0]} alt="" />
        <div>
          <p>{item.food?.name}</p>
          <p>₹{item.totalPrice}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap justify-end">
        <Button disabled className="cursor-not-allowed">
          {order.orderStatus}
        </Button>

        {canChangePayment && (
          <Button variant="outlined" color="primary" onClick={handleChangePayment}>
            Change Payment Method
          </Button>
        )}

        {isCancelable && (
          <Button color="error" variant="contained" onClick={handleCancel}>
            Cancel Order
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
