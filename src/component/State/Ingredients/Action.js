import { api, getErrorMessage } from "../../config/api"
import { CREATE_INGREDIENT_CATEGORY_FAILURE, CREATE_INGREDIENT_CATEGORY_REQUEST, CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_FAILURE, CREATE_INGREDIENT_REQUEST, CREATE_INGREDIENT_SUCCESS, GET_INGREDIENT_CATEGORY_FAILURE, GET_INGREDIENT_CATEGORY_REQUEST, GET_INGREDIENT_CATEGORY_SUCCESS, GET_INGREDIENTS, UPDATE_STOCK } from "./ActionsType";

export const getIngredientsOfRestaurant = ({ id }) => async (dispatch) => {
    try {
        const response = await api.get(`api/admin/ingredients/restaurant/${id}`);
        dispatch({ type: GET_INGREDIENTS, payload: response.data });
    } catch (error) {
        // No failure action type exists for this fetch; state simply keeps its previous value.
    }
};

export const createIngredient = ({ data }) => async (dispatch) => {
    dispatch({ type: CREATE_INGREDIENT_REQUEST });
    try {
        const response = await api.post(`api/admin/ingredients`, data);
        dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_INGREDIENT_FAILURE, payload: getErrorMessage(error, "Could not create ingredient") });
    }
};

export const createIngredientCategory = ({ data }) => async (dispatch) => {
    dispatch({ type: CREATE_INGREDIENT_CATEGORY_REQUEST });
    try {
        const response = await api.post(`api/admin/ingredients/category`, data);
        dispatch({ type: CREATE_INGREDIENT_CATEGORY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_INGREDIENT_CATEGORY_FAILURE, payload: getErrorMessage(error, "Could not create ingredient category") });
    }
};

export const getIngredientCategory = ({ id }) => async (dispatch) => {
    dispatch({ type: GET_INGREDIENT_CATEGORY_REQUEST });
    try {
        const response = await api.get(`api/admin/ingredients/restaurant/${id}/category`);
        dispatch({ type: GET_INGREDIENT_CATEGORY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_INGREDIENT_CATEGORY_FAILURE, payload: getErrorMessage(error, "Could not load ingredient categories") });
    }
};

export const updateStockOfIngredient = ({ id }) => async (dispatch) => {
    try {
        const { data } = await api.put(`api/admin/ingredients/${id}/stock`, {});
        dispatch({ type: UPDATE_STOCK, payload: data });
    } catch (error) {
        // No failure action type exists for stock updates; leave state unchanged.
    }
};
