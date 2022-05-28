import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCarts from "./_actions/cartActions";
import useCustomers from "./_actions/customerActions";

function Auth({ authRoute, redirectTo, children }) {
  let auth = useSelector((state) => state.customer.auth);
  const { customerAuth } = useCustomers();
  const { getCartItems} = useCarts()
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(customerAuth()).then(async (res) => {
      if (await !res.payload.status) {
        if (authRoute) {
          navigate(redirectTo);
        }
      } else {
        getCartItems();
        if (!authRoute) {
          navigate(redirectTo);
        }
      }
    });
  }, [dispatch, auth?.status]);

  return children;
}

export default Auth;
