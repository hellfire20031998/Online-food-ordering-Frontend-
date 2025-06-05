import {
    GET_INGREDIENTS,
    UPDATE_STOCK,
    CREATE_INGREDIENT_REQUEST,
    CREATE_INGREDIENT_SUCCESS,
    CREATE_INGREDIENT_FAILURE,
    CREATE_INGREDIENT_CATEGORY_REQUEST,
    CREATE_INGREDIENT_CATEGORY_SUCCESS,
    CREATE_INGREDIENT_CATEGORY_FAILURE,
    GET_INGREDIENT_CATEGORY_REQUEST,
    GET_INGREDIENT_CATEGORY_SUCCESS,
    GET_INGREDIENT_CATEGORY_FAILURE,
} from './ActionsType';

const initialState = {
    ingredients: [],
    update: null,
    category: [],
    loading: false,
    error: null,
};

export const ingredientReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INGREDIENTS:
            return {
                ...state,
                ingredients: action.payload,
            };

        case UPDATE_STOCK:
            return {
                ...state,
                update: action.payload, // could be confirmation or updated ingredient
                ingredients: state.ingredients.map(item =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };

        case CREATE_INGREDIENT_REQUEST:
        case CREATE_INGREDIENT_CATEGORY_REQUEST:
        case GET_INGREDIENT_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_INGREDIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                ingredients: [...state.ingredients, action.payload],
            };

        case CREATE_INGREDIENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category: [...state.category, action.payload],
            };

        case GET_INGREDIENT_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category: action.payload,
            };

        case CREATE_INGREDIENT_FAILURE:
        case CREATE_INGREDIENT_CATEGORY_FAILURE:
        case GET_INGREDIENT_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};
