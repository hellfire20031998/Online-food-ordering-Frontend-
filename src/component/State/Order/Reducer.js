import {
    CREATE_ORDER_FAILURE,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    GET_USERS_ORDERS_FAILURE,
    GET_USERS_ORDERS_REQUEST,
    GET_USERS_ORDERS_SUCCESS,
} from './ActionType';

const initialState = {
    loading: false,
    orders: [],
    createdOrder: null,
    error: null,
    notifications: [],
};

export const orderReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case CREATE_ORDER_REQUEST:
        case GET_USERS_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                createdOrder: payload,
                error: null,
            };

        case GET_USERS_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: payload,
                error: null,
            };

        case CREATE_ORDER_FAILURE:
        case GET_USERS_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload,
            };

        default:
            return state;
    }
};
