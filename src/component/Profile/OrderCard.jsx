import { Button, Card } from '@mui/material';
import React from 'react';

// Valid statuses: PENDING, OUT_FOR_DELIVERY, DELIVERED, COMPLETED, CANCELLED.
const OrderCard = ({ item, order, onCancel, onChangePaymentMethod }) => {
  const isCancelable = order.orderStatus === 'PENDING';
  const canChangePayment = isCancelable;

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel(order.id);
    }
  };

  const handleChangePayment = () => {
    if (typeof onChangePaymentMethod === 'function') {
      onChangePaymentMethod(order.id);
    }
  };

  return (
    <Card className="flex justify-between items-center p-5 flex-wrap gap-4">
      <div className="flex items-center space-x-5">
        {item.food?.images?.[0] && (
          <img className="h-16 w-16" src={item.food.images[0]} alt="" />
        )}
        <div>
          {/* Order items may arrive as { food: {...} } or the flat OrderDto shape { foodName, price }. */}
          <p>{item.food?.name || item.foodName}</p>
          <p>₹{Number(item.totalPrice ?? item.price ?? 0).toFixed(2)}</p>
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
