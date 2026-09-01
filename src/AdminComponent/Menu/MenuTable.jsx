import {
  Avatar,
  Box,
  Card,
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import React, { useEffect } from "react";
import { Create, Delete } from "@mui/icons-material";
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
  const restaurantId = useSelector((store) => store.restaurant.usersRestaurant?.id);
  const menuItems = useSelector((store) => store.menu.menuItems);

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId,
        vegetarian: false,
        nonVegetarian: false,
        seasonal: false,
        foodCategory: "",
      })
    );
  }, [dispatch, restaurantId]);

  const handleDeleteFood = (foodId) => {
    dispatch(deleteFoodAction({ foodId }));
  };

  const handleToggleAvailability = (foodId) => {
    // The endpoint toggles availability; the success action stores the updated item.
    dispatch(updateMenuItemAvailability({ foodId }));
  };

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
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar src={item.images?.[0]} />
                  </TableCell>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">₹{Number(item.price ?? 0).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    {item.ingredientsItems?.map((ingredient) => (
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
                      onClick={() => handleToggleAvailability(item.id)}
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
      </Card>
    </Box>
  );
}
