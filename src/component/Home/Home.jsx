import React, { useEffect } from "react";
import "./Home.css";
import MultiItemCarousel from "./MultiItemCarousel";
import RestaurantCart from "../Restaurant/RestaurantCart";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction } from "../State/Restaurant/Action";
import { useNavigate } from "react-router-dom";
import { findCart } from "../State/Cart/Action";

const restaurant = [1, 1, 1, 1, 1, 1];

const Home = () => {
  const dispatch = useDispatch();
  const jwt =localStorage.getItem("jwt")
  const {restaurants} = useSelector(store=>store.restaurant)
  const navigate = useNavigate();

  // console.log("restaurants ", restaurants);

  

  useEffect(()=>{
    if(jwt){
      dispatch(getAllRestaurantsAction(jwt))
    }
   
  },[])
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center">
          {restaurants.map((item, index) => (
            <RestaurantCart key={index} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
