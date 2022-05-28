import {
  DeleteTwoTone,
  DollarOutlined,
  EditTwoTone,
  ReloadOutlined,
  SaveTwoTone
} from "@ant-design/icons";
import {
  Button,
  Image,
  InputNumber,
  message,
  PageHeader,
  Space,
  Table,
  Typography
} from "antd";
import { sumBy } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import OrderResultModal from "../components/Modals/OrderResultModal";
import useCarts from "../_actions/cartActions";
import useOrders from "../_actions/orderActions";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateCartItem, removeCartItem, clearCart } = useCarts();
  const { checkout } = useOrders();
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
  const auth = useSelector((state) => state.customer.auth);
  const [editItem, setEditItem] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleEdit = (item) => {
    setEditItem(item);
    setQuantity(item.quantity);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleReset = () => {
    setEditItem(null);
  };

  const handleUpdateCartItem = (item) => {
    const data = {
      _productId: item?._product?._id,
      quantity,
    };
    dispatch(updateCartItem(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
        setEditItem(null);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const handleRemove = (item) => {
    dispatch(removeCartItem(item._product._id)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const handlePayout = (token, total) => {
    dispatch(checkout({ token, total })).then((res) => {
      if (res.payload.status) {
        clearCart();
        setShowResultModal(true);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const renderCartItems = () => {
    return (
      <Table columns={columns} dataSource={cartItems} scroll={{ x: 1300 }} />
    );
  };

  const columns = [
    {
      title: "Product",
      width: 80,
      dataIndex: "_product",
      key: "name",
      render: (item) => {
        return (
          <Space direction="vertical">
            <Typography.Text strong>{item?.name}</Typography.Text>
            <Image src={item?.image} alt="image" width={80} />
          </Space>
        );
      },
      fixed: "left",
    },
    {
      title: "Price ($)",
      width: 100,
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "Quantity",
      width: 100,
      align: "right",
      render: (item) => {
        if (editItem?._product?._id === item?._product?._id) {
          return (
            <InputNumber
              size="small"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
            />
          );
        }
        return <span>{item?.quantity}</span>;
      },
    },
    {
      title: "Amount ($)",
      width: 100,
      dataIndex: "amount",
      key: "amount",
      align: "right",
    },
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (item) => {
        return (
          <>
            {editItem?._product?._id === item?._product?._id ? (
              <span style={{ marginRight: 4 }}>
                <SaveTwoTone
                  style={{ marginRight: 4, fontSize: 16 }}
                  onClick={() => handleUpdateCartItem(item)}
                />
                <ReloadOutlined
                  style={{ fontSize: 16, color: "green" }}
                  onClick={handleReset}
                />
              </span>
            ) : (
              <EditTwoTone
                style={{ marginRight: 4, fontSize: 16 }}
                twoToneColor="orange"
                onClick={() => handleEdit(item)}
              />
            )}
            <DeleteTwoTone
              style={{ fontSize: 16 }}
              twoToneColor="red"
              onClick={() => handleRemove(item)}
            />
          </>
        );
      },
    },
  ];

  const renderCheckout = () => {
    const total = sumBy(cartItems, (item) => item.amount);
    if (cartItems?.length > 0) {
      return (
        <center>
          <p>Total amount: ${total}</p>
          <StripeCheckout
            name="Payment"
            email={auth?.data?.email}
            description="Payment for products"
            amount={total * 100}
            token={(token) => handlePayout(token, total)}
            stripeKey="pk_test_Cqva2BP5U88LaKrGcsygbXxJ00lsh0rRya"
          >
            <Button type="primary" icon={<DollarOutlined />}>
              Checkout
            </Button>
          </StripeCheckout>
        </center>
      );
    }
  };
  return (
    <>
      <PageHeader title="Your Cart" onBack={() => navigate(-1)} />
      <div className="page-wrapper">
        {renderCartItems()}
        {renderCheckout()}
        <OrderResultModal
          visible={showResultModal}
          onCancel={() => setShowResultModal(false)}
        />
      </div>
    </>
  );
}

export default Cart;
