import {
  Avatar,
  Box,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Create, Delete, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFoodAction,
  getMenuItemsByRestaurantId,
  updateMenuItemAvailability,
} from "../../component/State/Menu/Action";

export default function MenuTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurant, menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    dispatch(
      getMenuItemsByRestaurantId({
        jwt,
        restaurantID: restaurant.usersRestaurant.id,
        vegetarian: false,
        nonveg: false,
        seasonal: false,
        foodCategory: "",
      })
    );
  }, []);

  const handleDeleteFood = (foodId) => {
    dispatch(deleteFoodAction({ foodId, jwt }));
  };

  const handleMenuClick = (event, itemId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItemId(null);
  };

  const handleAvailabilityChange = (newAvailability) => {
    if (selectedItemId) {
      dispatch(updateMenuItemAvailability({
        foodId: selectedItemId,
        available: newAvailability,
        jwt,
      }));
      setMenuAnchorEl(null); // Close menu
      setSelectedItemId(null); // Reset
    }
  };
  

  console.log("menu table cart ",selectedItemId)

  return (
    <Box>
      <Card>
        <CardHeader
          title={"Menu"}
          action={
            <IconButton onClick={() => navigate("/admin/restaurant/add-menu")}>
              <Create />
            </IconButton>
          }
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Ingredients</TableCell>
                <TableCell align="right">Availability</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar src={item.images[0]} />
                  </TableCell>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">₹{item.price}</TableCell>
                  <TableCell align="right">
                    {item.ingredientsItems.map((ingredient) => (
                      <Chip
                        key={ingredient.id}
                        label={ingredient.name}
                        size="small"
                        sx={{ margin: 0.3 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.available ? "In Stock" : "Out of Stock"}
                      color={item.available ? "success" : "error"}
                      onClick={(e) => handleMenuClick(e, item.id)}
                      sx={{ cursor: "pointer" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDeleteFood(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Menu for toggling availability */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAvailabilityChange(true)}>In Stock</MenuItem>
          <MenuItem onClick={() => handleAvailabilityChange(false)}>Out of Stock</MenuItem>
        </Menu>
      </Card>
    </Box>
  );
}
