import { api, getErrorMessage } from "../../config/api";
import { CREATE_MENU_ITEM_FAILURE, CREATE_MENU_ITEM_REQUEST, CREATE_MENU_ITEM_SUCCESS, DELETE_MENU_ITEM_FAILURE, DELETE_MENU_ITEM_REQUEST, DELETE_MENU_ITEM_SUCCESS, GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST, GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, SEARCH_MENU_ITEM_FAILURE, SEARCH_MENU_ITEM_REQUEST, SEARCH_MENU_ITEM_SUCCESS, UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST, UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS } from "./ActionType"

export const createMenuItem = ({ menu }) => async (dispatch) => {
    dispatch({ type: CREATE_MENU_ITEM_REQUEST });
    try {
        const { data } = await api.post(`api/admin/food`, menu);
        dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: getErrorMessage(error, "Could not create menu item") });
    }
};

// Filters can change faster than the API answers; only the newest request may update the list.
let latestMenuRequest = 0;

// Public endpoint.
export const getMenuItemsByRestaurantId = (reqData) => async (dispatch) => {
    const requestId = ++latestMenuRequest;
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
    try {
        const { data } = await api.get(`api/food/restaurant/${reqData.restaurantId}`, {
            params: {
                vegetarian: reqData.vegetarian,
                nonVegetarian: reqData.nonVegetarian,
                seasonal: reqData.seasonal,
                foodCategory: reqData.foodCategory,
            },
        });
        if (requestId !== latestMenuRequest) return; // a newer filter/restaurant superseded this one
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
    } catch (error) {
        if (requestId !== latestMenuRequest) return;
        dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: getErrorMessage(error, "Could not load menu") });
    }
};

// Public endpoint.
export const searchMenuItem = ({ keyword }) => async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
        const { data } = await api.get(`api/food/search`, { params: { name: keyword } });
        dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: getErrorMessage(error, "Search failed") });
    }
};

export const updateMenuItemAvailability = ({ foodId }) => async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
        const { data } = await api.put(`api/admin/food/${foodId}`, {});
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, payload: getErrorMessage(error, "Could not update availability") });
    }
};

export const deleteFoodAction = ({ foodId }) => async (dispatch) => {
    dispatch({ type: DELETE_MENU_ITEM_REQUEST });
    try {
        await api.delete(`api/admin/food/${foodId}`);
        // Dispatch the id we deleted — the response body is only a message.
        dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
    } catch (error) {
        dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: getErrorMessage(error, "Could not delete menu item") });
    }
};
