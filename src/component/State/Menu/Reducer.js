import * as actionType from './ActionType';

const initialState = {
    menuItems: [],
    loading: false,
    error: null,
    search: [],
    message: null
};

const menuItemReducer = (state = initialState, action) => {
    switch (action.type) {
        // Create Menu Item
        case actionType.CREATE_MENU_ITEM_REQUEST:
            return { ...state, loading: true, error: null };
        case actionType.CREATE_MENU_ITEM_SUCCESS:
            return { ...state, loading: false, menuItems: [...state.menuItems, action.payload], message: "Menu item created successfully!" };
        case actionType.CREATE_MENU_ITEM_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Get Menu Items by Restaurant ID
        case actionType.GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST:
            return { ...state, loading: true, error: null };
        case actionType.GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS:
            return { ...state, loading: false, menuItems: action.payload };
        case actionType.GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Search Menu Item
        case actionType.SEARCH_MENU_ITEM_REQUEST:
            return { ...state, loading: true, error: null };
        case actionType.SEARCH_MENU_ITEM_SUCCESS:
            return { ...state, loading: false, search: action.payload };
        case actionType.SEARCH_MENU_ITEM_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Update Menu Item Availability
        case actionType.UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST:
            return { ...state, loading: true, error: null };
        case actionType.UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.map((item) =>
                    item.id === action.payload.id ? { ...item, available: action.payload.available } : item
                ),
                message: "Menu item availability updated!"
            };
        case actionType.UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Delete Menu Item
        case actionType.DELETE_MENU_ITEM_REQUEST:
            return { ...state, loading: true, error: null };
        case actionType.DELETE_MENU_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                menuItems: state.menuItems.filter(item => item.id !== action.payload.id),
                message: "Menu item deleted successfully!"
            };
        case actionType.DELETE_MENU_ITEM_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default menuItemReducer;
