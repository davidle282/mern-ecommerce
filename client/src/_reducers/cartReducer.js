import {
  ADD_TO_CART,

  CLEAR_CART_ITEM, GET_CART_ITEM,

  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM
} from "../_actions/types";

const initialState = {
  cartItems: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        cartItems: action.payload.data,
      };
    case UPDATE_CART_ITEM:
      return {
        cartItems: action.payload.data,
      };
    case REMOVE_CART_ITEM:
      return {
        cartItems: action.payload.data,
      };
    case GET_CART_ITEM:
      return {
        cartItems: action.payload.data,
      };
    case CLEAR_CART_ITEM:
      return {
        cartItems: [],
      };
    default:
      return state;
  }
};

export default cartReducer;
