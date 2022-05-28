import axios from "axios";
import { CUSTOMER_AUTH, CUSTOMER_CHANGE_PASSWORD, CUSTOMER_FORGOTPASSWORD, CUSTOMER_LOGIN, CUSTOMER_LOGOUT, CUSTOMER_REGISTER, CUSTOMER_RESETPASSWORD } from "./types";

export default function useCustomer() {
  const token = localStorage.getItem("customerToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const customerRegister = (data) => {
    const request = axios
      .post("/customers/register", data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: CUSTOMER_REGISTER,
      payload: request,
    };
  };


  const customerLogin = (data) => {
    const request = axios
      .post("/customers/login", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    return {
      type: CUSTOMER_LOGIN,
      payload: request,
    };
  };

  const customerAuth = () => {
    const request = axios
      .get("/customers/authUser", config)
      .then((res) => {
        return res.data
      })
      .catch((err) => err.response.data);
    return {
      type: CUSTOMER_AUTH,
      payload: request,
    };
  };

  const customerLogout = () => {
    const request = axios
      .get("/customers/logout", config)
      .then((res) => {
        return res.data
      })
      .catch((err) => err.response.data);
    return {
      type: CUSTOMER_LOGOUT,
      payload: request,
    };
  };

  const customerChangePassword = (data) => {
    const request = axios
      .put("/customers/changePassword", data, config)
      .then((res) => {
        return res.data
      })
      .catch((err) => err.response.data);
    return {
      type: CUSTOMER_CHANGE_PASSWORD,
      payload: request,
    };
  };

  const customerForgotPassword = (data) => {
    const request = axios
      .put("/customers/forgotPassword", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    return {
      type: CUSTOMER_FORGOTPASSWORD,
      payload: request,
    };
  };

  const customerResetPassword = (token, data) => {
    const request = axios
      .put(`/customers/resetPassword/${token}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    return {
      type: CUSTOMER_RESETPASSWORD,
      payload: request,
    };
  };



  return {
    customerRegister,
    customerLogin,
    customerAuth,
    customerLogout,
    customerChangePassword,
    customerForgotPassword,
    customerResetPassword
    
  };
}
