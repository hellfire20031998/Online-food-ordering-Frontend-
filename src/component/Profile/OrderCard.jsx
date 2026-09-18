import { Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { PAYMENT_METHOD_LABELS, paymentStatusLabel } from '../Payment/paymentApi';

const CANCELLABLE = ['PENDING', 'PAYMENT_PENDING', 'PAYMENT_FAILED'];

const humanize = (s) => (s ? s.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');
const money = (v, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(v || 0));

/** One order with all its items, payment state and the actions available to the customer. */
const OrderCard = ({ order, onCancel, onPayNow, onRequestRefund }) => {
  const payment = order.payment;
  const status = paymentStatusLabel(payment);
  const isOnline = payment?.provider && payment.provider !== 'CASH_ON_DELIVERY';

  const canPay = isOnline && (order.orderStatus === 'PAYMENT_PENDING' || order.orderStatus === 'PAYMENT_FAILED');
  const canCancel = CANCELLABLE.includes(order.orderStatus);
  const canRefund = payment && Number(payment.refundableAmount) > 0 && !payment.hasOpenRefund
    && order.orderStatus !== 'PAYMENT_PENDING' && order.orderStatus !== 'PAYMENT_FAILED';

  return (
    <Card className="p-5 space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <div>
          <Typography variant="subtitle1" fontWeight={600}>Order #{order.id}</Typography>
          <Typography variant="caption" color="text.secondary">
            {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
            {payment?.method && <> · {PAYMENT_METHOD_LABELS[payment.method] || humanize(payment.method)}</>}
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Chip size="small" label={humanize(order.orderStatus)} variant="outlined" />
          {status && <Chip size="small" label={status.text} color={status.color} />}
        </Stack>
      </Stack>

      <Divider />

      <div className="space-y-2">
        {(order.items || []).map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {item.food?.images?.[0] && <img className="h-12 w-12 object-cover rounded" src={item.food.images[0]} alt="" />}
              <Typography variant="body2">
                {item.quantity} × {item.food?.name || item.foodName}
              </Typography>
            </div>
            <Typography variant="body2">{money(item.totalPrice ?? item.price, payment?.currency)}</Typography>
          </div>
        ))}
      </div>

      <Divider />

      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <div>
          <Typography variant="subtitle2">Total {money(order.totalAmount, payment?.currency)}</Typography>
          {payment && Number(payment.refundedAmount) > 0 && (
            <Typography variant="caption" color="text.secondary">
              {money(payment.refundedAmount, payment.currency)} refunded
            </Typography>
          )}
          {payment?.status === 'FAILED' && payment.failureReason && (
            <Typography variant="caption" color="error" display="block">{payment.failureReason}</Typography>
          )}
        </div>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {canPay && <Button variant="contained" onClick={() => onPayNow(order)}>Pay now</Button>}
          {canRefund && <Button variant="outlined" onClick={() => onRequestRefund(order)}>Request refund</Button>}
          {canCancel && <Button color="error" variant="outlined" onClick={() => onCancel(order.id)}>Cancel order</Button>}
        </Stack>
      </Stack>
    </Card>
  );
};

export default OrderCard;
