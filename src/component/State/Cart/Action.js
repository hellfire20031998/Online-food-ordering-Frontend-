import { api, getErrorMessage } from '../../config/api';
import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEAR_CART_FAILURE, CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS, FIND_CART_FAILURE, FIND_CART_REQUEST, FIND_CART_SUCCESS, GET_ALL_CART_ITEMS_FAILURE, GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS, REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from './ActionType'

export const findCart = () => async (dispatch) => {
    dispatch({ type: FIND_CART_REQUEST });
    try {
        const response = await api.get(`api/cart/`);
        dispatch({ type: FIND_CART_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FIND_CART_FAILURE, payload: getErrorMessage(error, "Could not load cart") });
    }
};

export const getAllCartItems = (cartId) => async (dispatch) => {
    dispatch({ type: GET_ALL_CART_ITEMS_REQUEST });
    try {
        const response = await api.get(`api/carts/${cartId}/items`);
        dispatch({ type: GET_ALL_CART_ITEMS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ALL_CART_ITEMS_FAILURE, payload: getErrorMessage(error, "Could not load cart items") });
    }
};

export const addItemToCart = (cartItem) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    try {
        const { data } = await api.post(`api/cart/add`, cartItem);
        dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
        dispatch(findCart());
    } catch (error) {
        dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: getErrorMessage(error, "Could not add item to cart") });
    }
};

export const updateCartItem = ({ cartItemId, quantity }) => async (dispatch) => {
    dispatch({ type: UPDATE_CARTITEM_REQUEST });
    try {
        const { data } = await api.put(`api/cart-item/update`, { cartItemId, quantity });
        dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: data });
        dispatch(findCart());
    } catch (error) {
        dispatch({ type: UPDATE_CARTITEM_FAILURE, payload: getErrorMessage(error, "Could not update cart item") });
        dispatch(findCart());
    }
};

export const removeCartItem = ({ cartItemId }) => async (dispatch) => {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    try {
        const { data } = await api.delete(`api/cart-item/${cartItemId}/remove`);
        dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: data });
        dispatch(findCart());
    } catch (error) {
        dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: getErrorMessage(error, "Could not remove cart item") });
        dispatch(findCart());
    }
};

export const clearCartAction = () => async (dispatch) => {
    dispatch({ type: CLEAR_CART_REQUEST });
    try {
        const { data } = await api.delete(`api/cart/clear`);
        dispatch({ type: CLEAR_CART_SUCCESS, payload: data });
        dispatch(findCart());
    } catch (error) {
        dispatch({ type: CLEAR_CART_FAILURE, payload: getErrorMessage(error, "Could not clear cart") });
    }
};
