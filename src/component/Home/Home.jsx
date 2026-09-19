import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, CircularProgress } from "@mui/material";
import "./Home.css";
import MultiItemCarousel from "./MultiItemCarousel";
import RestaurantCart from "../Restaurant/RestaurantCart";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction } from "../State/Restaurant/Action";

const Home = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector(store => store.restaurant.restaurants);
  const loading = useSelector(store => store.restaurant.loading);
  const error = useSelector(store => store.restaurant.error);
  const [slow, setSlow] = useState(false);

  // The hosted API sleeps when idle; its first answer can take a while. Say so after a few seconds.
  useEffect(() => {
    if (!loading || restaurants.length > 0) { setSlow(false); return undefined; }
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, [loading, restaurants.length]);

  // Open restaurants first, closed ones last; the API already orders this way, this keeps it
  // stable if the list was loaded from elsewhere.
  const orderedRestaurants = useMemo(
    () => [...restaurants].sort((a, b) => Number(Boolean(b.open)) - Number(Boolean(a.open))),
    [restaurants]
  );

  useEffect(() => {
    // Public endpoint — browsing restaurants does not require a login.
    dispatch(getAllRestaurantsAction());
  }, [dispatch]);

  return (
    <div className="pb-10">
      {/* Banner Section */}
      <section className="banner z-50 relative flex flex-col justify-center items-center text-center px-5 lg:px-0">
        <div className="w-full sm:w-[70vw] md:w-[60vw] lg:w-[50vw] z-10">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold z-10 py-5">
            Foodiyapa
          </p>
          <p className="z-10 text-gray-300 text-lg sm:text-xl md:text-2xl lg:text-3xl">
            Taste the convenience: Food, Fast, and Delivered
          </p>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadout"></div>
      </section>

      {/* Top Meals Section */}
      <section className="p-5 sm:p-10 lg:py-10 lg:px-20">
        <p className="text-xl sm:text-2xl font-semibold text-gray-400 py-3 pb-10">
          Top Meals
        </p>
        <MultiItemCarousel />
      </section>

      {/* Handpicked Favorites Section */}
      <section className="px-5 sm:px-10 lg:px-20 pt-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-400 pb-5">
          Order from Handpicked Favorites
        </h1>

        {loading && restaurants.length === 0 && (
          <div className="flex items-center gap-3 text-gray-400 py-10">
            <CircularProgress size={22} />
            <span>{slow ? "Waking up the kitchen… the first load can take up to a minute." : "Loading restaurants…"}</span>
          </div>
        )}
        {error && restaurants.length === 0 && (
          <Alert
            severity="error"
            sx={{ maxWidth: 560 }}
            action={<Button color="inherit" size="small" onClick={() => dispatch(getAllRestaurantsAction())}>Retry</Button>}
          >
            {error}
          </Alert>
        )}
        {!loading && !error && restaurants.length === 0 && (
          <p className="text-gray-400 py-10">No restaurants are listed yet. Please check back soon.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center">
          {orderedRestaurants.map((item) => (
            <RestaurantCart key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
