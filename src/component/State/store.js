import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import { thunk } from "redux-thunk";
import restaurantReducer from "./Restaurant/Reducer";
import menuItemReducer from "./Menu/Reducer";
import cartReducer from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
import { ingredientReducer } from "./Ingredients/Reducer";
import restaurantOrderReducer from "./Restaurant Order/Reducer";

const rooteReducer= combineReducers({
    auth:authReducer,
    restaurant:restaurantReducer,
    menu:menuItemReducer,
    cart:cartReducer,
    order:orderReducer,
    ingredients:ingredientReducer,
    restaurantOrder:restaurantOrderReducer
})

export const store=legacy_createStore(rooteReducer,applyMiddleware(thunk));