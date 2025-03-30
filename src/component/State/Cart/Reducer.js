import { LOGOUT } from '../Authentication/ActionTypes';
import * as actionType from './ActionType';

const initialState = {
    cart: null,
    cartItems: [],
    loading: false,
    error: null,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.FIND_CART_REQUEST:
        case actionType.GET_ALL_CART_ITEMS_REQUEST:
        case actionType.ADD_ITEM_TO_CART_REQUEST:
        case actionType.UPDATE_CARTITEM_REQUEST:
        case actionType.REMOVE_CART_ITEM_REQUEST:
        case actionType.CLEAR_CART_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case actionType.FIND_CART_SUCCESS:
            return {
                ...state,
                cart: action.payload,
                loading: false,
            };

        case actionType.GET_ALL_CART_ITEMS_SUCCESS:
            return {
                ...state,
                cartItems: action.payload,
                loading: false,
            };

        case actionType.ADD_ITEM_TO_CART_SUCCESS:
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
                loading: false,
            };

        case actionType.UPDATE_CARTITEM_SUCCESS:
            return {
                ...state,
                cartItems: state.cartItems.map(item => 
                    item.id === action.payload.id ? action.payload : item
                ),
                loading: false,
            };

        case actionType.REMOVE_CART_ITEM_SUCCESS:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.id),
                loading: false,
            };

        case actionType.CLEAR_CART_SUCCESS:
            return {
                ...state,
                cartItems: [],
                loading: false,
            };

        case actionType.FIND_CART_FAILURE:
        case actionType.GET_ALL_CART_ITEMS_FAILURE:
        case actionType.ADD_ITEM_TO_CART_FAILURE:
        case actionType.UPDATE_CARTITEM_FAILURE:
        case actionType.REMOVE_CART_ITEM_FAILURE:
        case actionType.CLEAR_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case LOGOUT:
            localStorage.removeItem("jwt")
            return {...state, cartItems:[],cart:null,success:"logout success"}
        default:
            return state;
    }
};

export default cartReducer;
