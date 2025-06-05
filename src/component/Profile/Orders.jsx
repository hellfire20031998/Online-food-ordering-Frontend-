import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../State/Order/Action';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { Box, Button, MenuItem, Modal, Select, Typography } from '@mui/material';

const Orders = () => {
  const navigate = useNavigate();
  const { auth, order } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getUserOrders(jwt));
  }, [auth.jwt]);

  useEffect(() => {
    // Fetch available payment methods
    api.get("/api/payment-methods", {
      headers: { Authorization: `Bearer ${jwt}` }
    }).then(res => {
      setPaymentMethods(res.data);
    }).catch(err => {
      console.error("Failed to fetch payment methods", err);
    });
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await api.delete(`/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      alert("Order cancelled successfully");
      dispatch(getUserOrders(jwt));
    } catch (err) {
      alert("Unauthorized to Cancel Order");
      console.error(err);
    }
  };

  const handleChangePaymentMethod = (orderId) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleSubmitChangePayment = async () => {
    try {
      await api.put(`/api/changeMethod`, {
        orderId: selectedOrderId,
        paymentMethod: newPaymentMethod
      }, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
  
      alert("Payment method updated");
      setModalOpen(false);
      setNewPaymentMethod('');
      dispatch(getUserOrders(jwt));
  
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Unauthorized to change payment method");
      } else if (err.response?.status === 400) {
        alert("Invalid payment method");
      } else {
        alert("Failed to update payment method");
      }
      console.error(err);
    }
  };
  

  return (
    <div className='flex items-center flex-col'>
      <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
      <div className='space-y-5 w-full lg:w-1/2'>
        {
          order.orders.map(order =>
            order.items.map(item =>
              <OrderCard
                key={item.id}
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
            {paymentMethods.map((method, idx) => (
              <MenuItem key={idx} value={method}>{method}</MenuItem>
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
    </div>
  );
};

export default Orders;
