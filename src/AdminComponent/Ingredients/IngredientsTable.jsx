import { Box, Button, Card, CardHeader, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import { Create } from '@mui/icons-material';
import CreateIngredientForm from './CreateIngredientForm';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientsOfRestaurant, updateStockOfIngredient } from '../../component/State/Ingredients/Action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function IngredientsTable() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const restaurantId = useSelector(store => store.restaurant.usersRestaurant?.id);
  const ingredients = useSelector(store => store.ingredients.ingredients);

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(getIngredientsOfRestaurant({ id: restaurantId }))
  }, [dispatch, restaurantId])

  const handleUpdateStock = (id) => {
    dispatch(updateStockOfIngredient({ id }))
  }

  return (
    <Box>
      <Card className='m'>
        <CardHeader title={"Ingredients"}
          sx={{ paddingTop: 2, alignItems: 'center' }}
          action={
            <IconButton onClick={handleOpen} aria-label="settings">
              <Create />
            </IconButton>
          }>
        </CardHeader>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="ingredients table">
            <TableHead>
              <TableRow>
                <TableCell align="left">id</TableCell>
                <TableCell align="right">name</TableCell>
                <TableCell align="right">category</TableCell>
                <TableCell align="right">availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">{item.category?.name}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleUpdateStock(item.id)}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateIngredientForm />
        </Box>
      </Modal>
    </Box>
  )
}
