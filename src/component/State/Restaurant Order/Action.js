import { api, getErrorMessage } from "../../config/api";
import { GET_RESTAURANT_ORDER_FAILURE, GET_RESTAURANT_ORDER_REQUEST, GET_RESTAURANT_ORDER_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from "./ActionType"

export const updateOrderStatus = ({ orderId, orderStatus }) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
    try {
        const response = await api.put(`api/admin/order/${orderId}/${orderStatus}`, {});
        dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: getErrorMessage(error, "Could not update order status") });
    }
};

export const fetchRestaurantsOrder = ({ restaurantId, orderStatus }) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_ORDER_REQUEST });
    try {
        const { data } = await api.get(`api/admin/order/restaurant/${restaurantId}`, {
            params: { order_status: orderStatus },
        });
        dispatch({ type: GET_RESTAURANT_ORDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_ORDER_FAILURE, payload: getErrorMessage(error, "Could not load restaurant orders") });
    }
};
