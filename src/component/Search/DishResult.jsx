import React from "react";
import { Card, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { secureUrl } from "../util/secureUrl";
import { restaurantPath } from "./searchApi";

/** One dish in the search results. Tapping it opens the restaurant's menu, where it can be added. */
export default function DishResult({ dish }) {
  const navigate = useNavigate();
  const restaurant = dish.restaurant;
  const image = dish.images?.[0];

  return (
    <Card
      className="flex items-center gap-3 sm:gap-4 p-3 cursor-pointer hover:bg-white/5"
      onClick={() => restaurant && navigate(restaurantPath(restaurant))}
    >
      {image ? (
        <img className="w-16 h-16 sm:w-20 sm:h-20 flex-none rounded object-cover" src={secureUrl(image)} alt="" />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-none rounded bg-white/5" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{dish.name}</p>
          {dish.vegetarian && <Chip size="small" label="Veg" color="success" variant="outlined" />}
        </div>
        <p className="text-gray-400 text-sm truncate">{dish.description}</p>
        {restaurant && (
          <p className="text-gray-500 text-xs mt-1 truncate">
            {restaurant.name}
            {restaurant.address?.city ? ` · ${restaurant.address.city}` : ""}
            {!restaurant.open && <span className="text-red-400"> · Closed</span>}
          </p>
        )}
      </div>
      <p className="font-medium whitespace-nowrap">₹{Number(dish.price ?? 0).toFixed(2)}</p>
    </Card>
  );
}
