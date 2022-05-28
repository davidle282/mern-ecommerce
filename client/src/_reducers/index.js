import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import customerReducer from './customerReducer';
import orderReducer from "./orderReducer";
import productReducer from './productReducer';

const rootReducer = combineReducers({
  customer: customerReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer

});

export default rootReducer;