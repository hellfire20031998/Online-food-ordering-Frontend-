import { api, getErrorMessage } from "../../config/api"
import { clearCartAction } from "../Cart/Action"
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionType"

// Returns { success, data | message } so callers can await the outcome
// and only show success feedback once the order really was created.
export const createOrder = (order) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST })
    try {
        // Backend returns the created OrderDto directly (201), not wrapped in { order, authorized }.
        const response = await api.post('api/order', order)
        const createdOrder = response.data

        dispatch({ type: CREATE_ORDER_SUCCESS, payload: createdOrder })
        dispatch(clearCartAction())
        return { success: true, data: createdOrder }
    } catch (error) {
        const status = error.response?.status
        let message = getErrorMessage(error, "Failed to place order")
        if (status === 401 || status === 403) {
            message = getErrorMessage(error, "You are not authorized to place this order")
        }
        dispatch({ type: CREATE_ORDER_FAILURE, payload: message })
        return { success: false, message }
    }
}

export const getUserOrders = () => async (dispatch) => {
    dispatch({ type: GET_USERS_ORDERS_REQUEST })
    try {
        const { data } = await api.get(`api/order/user`)
        dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: getErrorMessage(error, "Could not load orders") })
    }
}
