import {
  Avatar, AvatarGroup, Box, Button, Card, CardHeader, Chip,
  Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurantsOrder, updateOrderStatus } from '../../component/State/Restaurant Order/Action';

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" }
];

export default function OrderTable() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurant, restaurantOrder } = useSelector((store) => store)
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    dispatch(fetchRestaurantsOrder({ jwt, restaurantId: restaurant.usersRestaurant?.id }))
  }, []);

  const handleClick = (event, orderId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setSelectedOrderId(null);
  };

  const handleUpdateOrder = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, orderStatus: status, jwt }));
    handleClose();
  };

  return (
    <Box>
      <Card className='m'>
        <CardHeader title="All Orders" sx={{ paddingTop: 2, alignItems: 'center' }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Image</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Item Name</TableCell>
                <TableCell align="right">Ingredients</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantOrder.orders.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell align="right">
                    <AvatarGroup>
                      {item.items.map((orderItem, i) => (
                        <Avatar key={i} src={orderItem.food?.images?.[0]} />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell align="right">{item.totalPrice}</TableCell>
                  <TableCell align="right">{item.customer?.fullName}</TableCell>
                  <TableCell align="right">
                    {item.items.map((orderItem, i) => (
                      <Chip key={i} label={orderItem.food?.name} sx={{ m: 0.3 }} />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {item.items.map((orderItem, i) => (
                      <div key={i}>
                        {orderItem.ingredients.map((ing, j) => (
                          <Chip key={j} label={ing} sx={{ m: 0.3 }} />
                        ))}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">{item.orderStatus}</TableCell>
                  <TableCell align="right">
                    <Button onClick={(e) => handleClick(e, item.id)}>Update</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Menu rendered once for all rows */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleClose}
        >
          {orderStatus.map((status) => (
            <MenuItem
              key={status.value}
              onClick={() => handleUpdateOrder(selectedOrderId, status.value)}
            >
              {status.label}
            </MenuItem>
          ))}
        </Menu>
      </Card>
    </Box>
  );
}
