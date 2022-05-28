import {
  CATEGORY_LIST,
  PRODUCT_LIST,
  PRODUCT_LIST_MORE
} from "../_actions/types";

const initialState = {
  productList: null,
  categoryList: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_LIST:
      return {
        ...state,
        categoryList: action.payload.data,
      };
    case PRODUCT_LIST:
      return {
        ...state,
        productList: action.payload.data,
      };
    case PRODUCT_LIST_MORE:
      return {
        ...state,
        productList: [...state.productList, ...action.payload.data],
      };

    default:
      return state;
  }
};

export default productReducer;
