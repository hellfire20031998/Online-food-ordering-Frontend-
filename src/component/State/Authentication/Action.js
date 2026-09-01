import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionTypes"
import { api, getErrorMessage, profile } from "../../config/api"
import { getAllRestaurantsAction } from "../Restaurant/Action"

export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST })
    try {
        const { data } = await api.post(`auth/signup`, reqData.userData)

        if (data.jwt) localStorage.setItem("jwt", data.jwt)
        if (data.role === "ADMIN") {
            reqData.navigate("/admin/restaurant")
        } else {
            reqData.navigate("/")
        }

        dispatch({ type: REGISTER_SUCCESS, payload: data.jwt })
        dispatch(getUser())
        dispatch(getAllRestaurantsAction())
    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, payload: getErrorMessage(error, "Registration failed") })
    }
}

export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const { data } = await api.post(`auth/signin`, reqData.userData)

        if (data.jwt) localStorage.setItem("jwt", data.jwt)
        if (data.role === "ADMIN") {
            reqData.navigate("/admin/restaurant")
        } else {
            reqData.navigate("/")
        }

        dispatch({ type: LOGIN_SUCCESS, payload: data.jwt })
        dispatch(getUser())
        dispatch(getAllRestaurantsAction())
    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: getErrorMessage(error, "Login failed") })
    }
}

export const getUser = () => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST })
    try {
        const { data } = await api.get(profile)
        dispatch({ type: GET_USER_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: getErrorMessage(error, "Could not load profile") })
    }
}

export const addToFavorite = ({ restaurantId }) => async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITE_REQUEST })
    try {
        const { data } = await api.put(`api/restaurants/${restaurantId}/add-favorites`, {})
        dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: getErrorMessage(error, "Could not update favorites") })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem("jwt")
    dispatch({ type: LOGOUT, payload: null })
}
