import axios from "axios";
import { useDispatch } from "react-redux";
import { CATEGORY_LIST, PRODUCT_LIST, PRODUCT_LIST_MORE } from "./types";

export default function useProducts() {
  const dispatch = useDispatch();
  const getProductList = (query) => {
    const result = axios
      .post("/products", query)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    if (query.loadMore) {
      dispatch({
        type: PRODUCT_LIST_MORE,
        payload: result,
      });
    } else {
      dispatch({
        type: PRODUCT_LIST,
        payload: result,
      });
    }
  };

  const getCategoryList = () => {
    const result = axios
      .get("/categories")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    dispatch({
      type: CATEGORY_LIST,
      payload: result,
    });
  };

  return {
    getProductList,
    getCategoryList,
  };
}
