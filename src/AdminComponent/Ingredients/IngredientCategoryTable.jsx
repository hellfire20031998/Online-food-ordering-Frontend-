import { Box, Card, CardActions, CardHeader, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import { Create, Delete } from '@mui/icons-material';
import CreateIngredientCategoryForm from './CreateCategoryForm';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientCategory } from '../../component/State/Ingredients/Action';

const orders= [1,1,1,1,1];
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

export default function IngredientCategoryTable() {
  const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const dispatch = useDispatch();
    const{restaurant,ingredients} = useSelector(store=>store)
    const jwt = localStorage.getItem('jwt')

    useEffect(()=>{
      dispatch(getIngredientCategory({id:restaurant.usersRestaurant?.id,jwt}))
    },[])
  return (
    <Box>
        <Card className='m'>
            <CardHeader title={"Ingredient Category"}
            sx={{paddingTop:2, alignItems:'center'}}
            action={
                <IconButton onClick={handleOpen} aria-label="settings">
                  <Create />
                </IconButton>
              }>
            
            </CardHeader>
            <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            
            <TableCell align="left">id</TableCell>
            <TableCell align="left">name</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.category.map((item,index) => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index+1}
              </TableCell>
              
              
              <TableCell align="left">{item.name}</TableCell>
              
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
         <CreateIngredientCategoryForm/>
        </Box>
      </Modal>  
    </Box>
  )
}
