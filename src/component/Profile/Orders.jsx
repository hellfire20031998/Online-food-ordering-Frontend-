import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../State/Order/Action';
import { api, getErrorMessage } from '../config/api';
import { Alert, Box, Button, MenuItem, Modal, Select, Snackbar, Typography } from '@mui/material';

const Orders = () => {
  const orders = useSelector(store => store.order.orders);
  const dispatch = useDispatch();

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  useEffect(() => {
    api.get("api/payment-methods")
      .then(res => setPaymentMethods(res.data))
      .catch(() => setPaymentMethods([]));
  }, []);

  const handleCancel = async (orderId) => {
    try {
      // Sets the order status to CANCELLED on the backend.
      await api.delete(`api/order/${orderId}`);
      showSnackbar("Order cancelled successfully", "success");
      dispatch(getUserOrders());
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Could not cancel order"), "error");
    }
  };

  const handleChangePaymentMethod = (orderId) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleSubmitChangePayment = async () => {
    try {
      await api.put(`api/changeMethod`, {
        orderId: selectedOrderId,
        paymentMethod: newPaymentMethod
      });

      showSnackbar("Payment method updated", "success");
      setModalOpen(false);
      setNewPaymentMethod('');
      dispatch(getUserOrders());
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Failed to update payment method"), "error");
    }
  };

  return (
    <div className='flex items-center flex-col'>
      <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
      <div className='space-y-5 w-full lg:w-1/2'>
        {
          orders.map(order =>
            order.items.map(item =>
              <OrderCard
                key={`${order.id}-${item.id}`}
                item={item}
                order={order}
                onCancel={handleCancel}
                onChangePaymentMethod={handleChangePaymentMethod}
              />
            )
          )
        }
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper',
          boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Change Payment Method
          </Typography>
          <Select
            fullWidth
            value={newPaymentMethod}
            onChange={(e) => setNewPaymentMethod(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Select a payment method</MenuItem>
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>{method}</MenuItem>
            ))}
          </Select>
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleSubmitChangePayment}
            disabled={!newPaymentMethod}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

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
