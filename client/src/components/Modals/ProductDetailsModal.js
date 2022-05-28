import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  InputNumber,



  message, Modal, Row,
  Space,
  Typography
} from "antd";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import useCarts from '../../_actions/cartActions';

const { Title, Text } = Typography;

function ProductDetailsModal(props) {
  const { product, visible, onCancel } = props;
  const dispatch = useDispatch();
  const {addToCart} = useCarts();
  const [quantity, setQuantity] = useState(1);

  const handleChangeQuantity = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = (item) => {
    const data = {
      _productId: item._id,
      quantity,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
        setQuantity(1);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  return (
    <Modal
      title={product?.name}
      width={700}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Row gutter={12}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Image src={product?.image} />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Space direction="vertical">
            <Title level={5}>{product?.name}</Title>
            <Text type="secondary">{product?._category?.name}</Text>
            <Text type="success">${product?.price}</Text>
            <Text italic>{product?.description}</Text>
            <Space direction="horizontal">
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleChangeQuantity}
              />
              <Button
                type="primary"
                icon={<ShoppingCartOutlined style={{ fontSize: 18 }} />}
                onClick={() => handleAddToCart(product)}
              >
                Add To Cart
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}

export default ProductDetailsModal;
