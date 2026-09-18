import React, { useEffect, useRef, useState } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../State/Order/Action';
import { api, getErrorMessage } from '../config/api';
import { Alert, Snackbar, Typography } from '@mui/material';
import { paymentApi } from '../Payment/paymentApi';
import StripePaymentDialog from '../Payment/StripePaymentDialog';
import RefundRequestDialog from '../Payment/RefundRequestDialog';

const Orders = () => {
  const orders = useSelector(store => store.order.orders);
  const dispatch = useDispatch();

  const [paymentConfig, setPaymentConfig] = useState(null);
  const [paying, setPaying] = useState(null);      // PaymentDto with clientSecret
  const [refunding, setRefunding] = useState(null); // order
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const reconciled = useRef(new Set());

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    dispatch(getUserOrders());
    paymentApi.config().then(setPaymentConfig).catch(() => setPaymentConfig(null));
  }, [dispatch]);

  // After a redirect-based payment (e.g. UPI) the browser lands here before the webhook may have
  // arrived: ask the server to check each awaiting payment with the gateway once.
  useEffect(() => {
    const awaiting = orders.filter(o => o.orderStatus === 'PAYMENT_PENDING' && o.payment?.id
      && o.payment.provider !== 'CASH_ON_DELIVERY' && !reconciled.current.has(o.payment.id));
    if (awaiting.length === 0) return;
    awaiting.forEach(o => reconciled.current.add(o.payment.id));
    Promise.allSettled(awaiting.map(o => paymentApi.confirm(o.payment.id)))
      .then(results => {
        if (results.some(r => r.status === 'fulfilled' && r.value?.status !== 'PENDING')) {
          dispatch(getUserOrders());
        }
      });
  }, [orders, dispatch]);

  const handleCancel = async (orderId) => {
    try {
      await api.delete(`api/order/${orderId}`);
      showSnackbar("Order cancelled. Any payment will be refunded.", "success");
      dispatch(getUserOrders());
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Could not cancel order"), "error");
    }
  };

  const handlePayNow = async (order) => {
    try {
      const payment = await paymentApi.forOrder(order.id);
      if (!payment.clientSecret) {
        showSnackbar("This order can no longer be paid online.", "warning");
        dispatch(getUserOrders());
        return;
      }
      setPaying(payment);
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Could not start the payment"), "error");
    }
  };

  return (
    <div className='flex items-center flex-col'>
      <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
      <div className='space-y-5 w-full lg:w-2/3 px-4'>
        {orders.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">You have not placed any orders yet.</Typography>
        )}
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={handleCancel}
            onPayNow={handlePayNow}
            onRequestRefund={setRefunding}
          />
        ))}
      </div>

      {paying && (
        <StripePaymentDialog
          publishableKey={paymentConfig?.publishableKey}
          payment={paying}
          onSuccess={() => {
            setPaying(null);
            showSnackbar("Payment received. Thank you!", "success");
            dispatch(getUserOrders());
          }}
          onClose={() => setPaying(null)}
        />
      )}

      <RefundRequestDialog
        order={refunding}
        onClose={() => setRefunding(null)}
        onSubmitted={() => {
          setRefunding(null);
          showSnackbar("Refund request submitted. We will email you once it is reviewed.", "success");
          dispatch(getUserOrders());
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Orders;
