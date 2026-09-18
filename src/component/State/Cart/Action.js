import { api, getErrorMessage } from '../../config/api';
import {
    ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS,
    CLEAR_CART_FAILURE, CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS,
    FIND_CART_FAILURE, FIND_CART_REQUEST, FIND_CART_SUCCESS,
    GET_ALL_CART_ITEMS_FAILURE, GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS,
    REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS,
    UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS
} from './ActionType'
import {
    addGuestItem, clearGuestCart, guestCartView, guestItemsForMerge, loadGuestCart,
    removeGuestItem, updateGuestItem
} from '../../Cart/guestCart';

// Visitors keep their cart in the browser; signed-in users use the account cart on the server.
const isGuest = () => !localStorage.getItem("jwt");

/** Hydrates the store from the browser cart (visitors only). */
export const loadGuestCartAction = () => (dispatch) => {
    dispatch({ type: FIND_CART_SUCCESS, payload: guestCartView(loadGuestCart()) });
};

export const findCart = () => async (dispatch) => {
    if (isGuest()) {
        dispatch(loadGuestCartAction());
        return;
    }
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

/**
 * Adds a dish. `cartItem` = { foodId, quantity, ingredients, replaceCart, food }, where `food`
 * carries id, name, price, images, restaurantId, restaurantName (needed for the visitor cart).
 * Resolves to { success } or { success: false, conflict: { currentRestaurantName, message } }.
 */
export const addItemToCart = (cartItem) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });

    if (isGuest()) {
        const result = addGuestItem({
            food: cartItem.food,
            quantity: cartItem.quantity || 1,
            ingredients: cartItem.ingredients || [],
            replace: Boolean(cartItem.replaceCart),
        });
        if (result.conflict) {
            dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: null });
            return { success: false, conflict: result.conflict };
        }
        dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: null });
        dispatch({ type: FIND_CART_SUCCESS, payload: result.cart });
        return { success: true };
    }

    try {
        const { data } = await api.post(`api/cart/add`, {
            foodId: cartItem.foodId,
            quantity: cartItem.quantity || 1,
            ingredients: cartItem.ingredients || [],
            replaceCart: Boolean(cartItem.replaceCart),
        });
        dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
        dispatch(findCart());
        return { success: true };
    } catch (error) {
        const message = getErrorMessage(error, "Could not add item to cart");
        dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: message });
        if (error?.response?.status === 409) {
            return { success: false, conflict: { message } };
        }
        return { success: false, message };
    }
};

export const updateCartItem = ({ cartItemId, quantity }) => async (dispatch) => {
    dispatch({ type: UPDATE_CARTITEM_REQUEST });
    if (isGuest()) {
        dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: null });
        dispatch({ type: FIND_CART_SUCCESS, payload: updateGuestItem(cartItemId, quantity) });
        return;
    }
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
    if (isGuest()) {
        dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: null });
        dispatch({ type: FIND_CART_SUCCESS, payload: removeGuestItem(cartItemId) });
        return;
    }
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
    if (isGuest()) {
        dispatch({ type: CLEAR_CART_SUCCESS, payload: guestCartView(clearGuestCart()) });
        return;
    }
    try {
        const { data } = await api.delete(`api/cart/clear`);
        dispatch({ type: CLEAR_CART_SUCCESS, payload: data });
        dispatch(findCart());
    } catch (error) {
        dispatch({ type: CLEAR_CART_FAILURE, payload: getErrorMessage(error, "Could not clear cart") });
    }
};

/**
 * After sign-in: carries the browser cart into the account cart.
 * strategy: MERGE | REPLACE | KEEP_SERVER. Resolves to { success, skipped } or { conflict } (409).
 */
export const mergeGuestCart = (strategy) => async (dispatch) => {
    try {
        const { data } = await api.post(`api/cart/merge`, { strategy, items: guestItemsForMerge() });
        clearGuestCart();
        dispatch({ type: FIND_CART_SUCCESS, payload: data.cart });
        return { success: true, skipped: data.skipped || [] };
    } catch (error) {
        if (error?.response?.status === 409) {
            return { success: false, conflict: true, message: getErrorMessage(error) };
        }
        return { success: false, message: getErrorMessage(error, "Could not carry over your cart") };
    }
};
