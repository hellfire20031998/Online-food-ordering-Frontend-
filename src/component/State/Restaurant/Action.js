import { api, getErrorMessage } from '../../config/api';
import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_RESTAURANT_FAILURE, CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, DELETE_RESTAURANT_FAILURE, DELETE_RESTAURANT_REQUEST, DELETE_RESTAURANT_SUCCESS, GET_ALL_RESTAURANTS_FAILURE, GET_ALL_RESTAURANTS_REQUEST, GET_ALL_RESTAURANTS_SUCCESS, GET_RESTAURANT_BY_ID_FAILURE, GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAILURE, GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANTS_CATEGORY_FAILURE, GET_RESTAURANTS_CATEGORY_REQUEST, GET_RESTAURANTS_CATEGORY_SUCCESS, UPDATE_RESTAURANT_FAILURE, UPDATE_RESTAURANT_REQUEST, UPDATE_RESTAURANT_STATUS_FAILURE, UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_SUCCESS } from './ActionType'

// Public endpoint — works with or without a JWT (interceptor adds one when present).
export const getAllRestaurantsAction = () => async (dispatch) => {
    dispatch({ type: GET_ALL_RESTAURANTS_REQUEST });
    try {
        const { data } = await api.get("api/restaurants");
        dispatch({ type: GET_ALL_RESTAURANTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_ALL_RESTAURANTS_FAILURE, payload: getErrorMessage(error, "Could not load restaurants") });
    }
};

export const getRestaurantById = (restaurantId) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST });
    try {
        const response = await api.get(`api/restaurants/${restaurantId}`);
        dispatch({ type: GET_RESTAURANT_BY_ID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_BY_ID_FAILURE, payload: getErrorMessage(error, "Could not load restaurant") });
    }
};

export const getRestaurantByUserId = () => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST });
    try {
        const { data } = await api.get(`api/admin/restaurants/user`);
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_BY_USER_ID_FAILURE, payload: getErrorMessage(error, "Could not load your restaurant") });
    }
};

export const createRestaurant = (restaurantData) => async (dispatch) => {
    dispatch({ type: CREATE_RESTAURANT_REQUEST });
    try {
        const { data } = await api.post(`api/admin/restaurants`, restaurantData);
        dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_RESTAURANT_FAILURE, payload: getErrorMessage(error, "Could not create restaurant") });
    }
};

export const updateRestaurant = ({ restaurantId, restaurantData }) => async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_REQUEST });
    try {
        const res = await api.put(`api/admin/restaurant/${restaurantId}`, restaurantData);
        dispatch({ type: UPDATE_RESTAURANT_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: UPDATE_RESTAURANT_FAILURE, payload: getErrorMessage(error, "Could not update restaurant") });
    }
};

export const deleteRestaurant = (restaurantId) => async (dispatch) => {
    dispatch({ type: DELETE_RESTAURANT_REQUEST });
    try {
        await api.delete(`api/admin/restaurant/${restaurantId}`);
        dispatch({ type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId });
    } catch (error) {
        dispatch({ type: DELETE_RESTAURANT_FAILURE, payload: getErrorMessage(error, "Could not delete restaurant") });
    }
};

export const updateRestaurantStatus = ({ restaurantId }) => async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST });
    try {
        const res = await api.put(`api/admin/restaurants/${restaurantId}/status`, {});
        dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: getErrorMessage(error, "Could not update restaurant status") });
    }
};

export const createCategory = (reqData) => async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
        const res = await api.post(`api/admin/category`, reqData);
        dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: CREATE_CATEGORY_FAILURE, payload: getErrorMessage(error, "Could not create category") });
    }
};

// Public endpoint.
export const getRestaurantsCategory = ({ restaurantId }) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANTS_CATEGORY_REQUEST });
    try {
        const res = await api.get(`api/category/restaurant/${restaurantId}`);
        dispatch({ type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: getErrorMessage(error, "Could not load categories") });
    }
};
