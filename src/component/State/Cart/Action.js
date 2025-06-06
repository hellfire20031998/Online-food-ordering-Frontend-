
import { api } from '../../config/api';
import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEAR_CART_FAILURE, CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS, FIND_CART_FAILURE, FIND_CART_REQUEST, FIND_CART_SUCCESS, GET_ALL_CART_ITEMS_FAILURE, GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS, REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from './ActionType'


export const findCart=(token)=>{
    return async (dispatch)=>{
        dispatch({type:FIND_CART_REQUEST});

        try {
            const response=await api.get(`api/cart/`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            // console.log("my cart " , response.data)
            dispatch({type: FIND_CART_SUCCESS,payload:response.data})
            
        } catch (error) {
            dispatch({type:FIND_CART_FAILURE,payload:error})
        }
    }
}
export const getAllCartItems=(reqData)=>{
    return async (dispatch)=>{
        dispatch({type:GET_ALL_CART_ITEMS_REQUEST});
        console.log("update cart item ", reqData)

        try {
            const response=await api.get(`api/carts/${reqData.data.cartId}/items`,{
                headers:{
                    Authorization:`Bearer ${reqData.jwt}`
                }
            })
            dispatch({type: GET_ALL_CART_ITEMS_SUCCESS,payload:response.data})
            
        } catch (error) {
            dispatch({type:GET_ALL_CART_ITEMS_FAILURE,payload:error})
        }
    }
}
export const addItemToCart=(reqData)=>{
    return async (dispatch)=>{
        dispatch({type:ADD_ITEM_TO_CART_REQUEST});
         console.log("reqData ", reqData.cartItem)

        try {
            const {data}=await api.post(`api/cart/add`,reqData.cartItem,{
                headers:{
                    Authorization:`Bearer ${reqData.token}`,
                    "Content-Type": "application/json",
                }
            })
            dispatch(findCart(reqData.token))
            dispatch({type:ADD_ITEM_TO_CART_SUCCESS,payload:data})
            
        } catch (error) {

            dispatch({type:ADD_ITEM_TO_CART_FAILURE,payload:error})
        }
    }
}
export const updateCartItem=(reqData)=>{
    return async (dispatch)=>{
        dispatch({type:UPDATE_CARTITEM_REQUEST});
        

        try {
            const {data}=await api.put(`api/cart-item/update`,reqData.data,{
                headers:{
                    Authorization:`Bearer ${reqData.jwt}`
                }
            })
            console.log("updated cart item res ", data)
            dispatch(findCart(reqData.jwt))
            dispatch({type:UPDATE_CARTITEM_SUCCESS,payload:reqData.data})
           
        } catch (error) {
            dispatch(findCart(reqData.jwt))
            // dispatch({type: GET_ALL_CART_ITEMS_SUCCESS,payload:[]})
            dispatch({type:UPDATE_CARTITEM_FAILURE,payload:error})
        }
    }
}
export const removeCartItem=({item,jwt})=>{
    

    console.log("remove cart item req ", item)
    return async (dispatch)=>{
        dispatch({type:REMOVE_CART_ITEM_REQUEST});

        try {
            const {data}=await api.delete(`api/cart-item/${item.id}/remove`,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                }
            })
            console.log("remove cart item res ", data)
            dispatch({type:REMOVE_CART_ITEM_SUCCESS,payload:data})
            
        } catch (error) {
            console.log("removeCartItem error", error)
            dispatch(findCart(jwt))
            dispatch({type:REMOVE_CART_ITEM_FAILURE,payload:error})
        }
    }
}
export const clearCartAction=()=>{
    return async (dispatch)=>{
        dispatch({type:CLEAR_CART_REQUEST});

        try {
            const {data}=await api.delete(`api/cart/clear`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("jwt")}`
                }
            })
            dispatch(findCart(localStorage.getItem("jwt")))
            dispatch({type:CLEAR_CART_SUCCESS,payload:data})
            
        } catch (error) {
            dispatch({type:CLEAR_CART_FAILURE,payload:error})
        }
    }
}