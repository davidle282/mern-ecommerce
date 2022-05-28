import {
  CUSTOMER_AUTH,
  CUSTOMER_LOGIN,
  CUSTOMER_LOGOUT
} from "../_actions/types";

const initialState = {
  auth: null,
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_LOGIN:
      console.log("login payload: ", action.payload);
      return {
        auth: {
          data: action.payload?.data?.customer,
          status: action.payload?.status,
        },
      };
    case CUSTOMER_AUTH:
      return {
        auth: action.payload,
      };
    case CUSTOMER_LOGOUT:
      const isAuth = action.payload.status;
      return {
        auth: !isAuth,
      };

    default:
      return state;
  }
};

export default customerReducer;
