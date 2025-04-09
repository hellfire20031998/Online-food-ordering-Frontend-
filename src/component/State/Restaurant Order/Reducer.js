import {
    GET_RESTAURANT_ORDER_REQUEST,
    GET_RESTAURANT_ORDER_SUCCESS,
    GET_RESTAURANT_ORDER_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    error: null,
    orders: [],
};

const restaurantOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_RESTAURANT_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_RESTAURANT_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload, // assuming payload contains fetched orders
                error: null,
            };

        case GET_RESTAURANT_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, // assuming payload contains error message
            };

        case UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map(order =>
                    order.id === action.payload.id ? { ...order, status: action.payload.status } : order
                ),
                error: null,
            };

        case UPDATE_ORDER_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default restaurantOrderReducer;
