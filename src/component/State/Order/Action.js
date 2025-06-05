import { api } from "../../config/api"
import { clearCartAction, findCart } from "../Cart/Action"
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionType"



export const createOrder = (reqData) =>{

    console.log("Order create req", reqData)
    return async (dispatch)=>{
        dispatch({type:CREATE_ORDER_REQUEST})
        try{
            const response = await api.post('api/order',reqData.order,{
                headers:{
                    Authorization: `Bearer ${reqData.jwt}`,
                }
            })
            
           
            console.log("Created order data", response.data)

            dispatch({type:CREATE_ORDER_SUCCESS, payload:response.data.order})
            dispatch(clearCartAction())
            dispatch(findCart(reqData.jwt));
           
           
        }catch(error){
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("create order error " , error)
                alert("You are not authorized");
              }
            dispatch({type:CREATE_ORDER_FAILURE,payload:error})
        }
    }
}

export const getUserOrders = (jwt) => {
    console.log("user jwt ----",jwt)
    return async (dispatch) => {
        dispatch({ type: GET_USERS_ORDERS_REQUEST });
        try {
            const { data } = await api.get(`api/order/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("users order ", data);
            dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: error });
        }
    };
};
