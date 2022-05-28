import {
  DownOutlined,
  EyeOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { Card, Carousel, Col, message, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import ProductFilters from "../components/Filters/ProductFilters";
import ProductDetailsModal from "../components/Modals/ProductDetailsModal";
import useCarts from "../_actions/cartActions";
import useProducts from "../_actions/productActions";

const contentStyle = {
  width: "100%",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const { Text } = Typography;

const initialQuery = {
  skip: 0,
  filters: { price: { $gte: 4, $lte: 20 } },
};

function Home() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const { getProductList } = useProducts();
  const { addToCart } = useCarts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const handleShowProductDetails = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleLoadMore = () => {
    const newQuery = {
      ...query,
      skip: query.skip + 8,
      loadMore: true,
    };
    setQuery(newQuery);
    getProductList(newQuery);
  };

  const handleSearchProduct = (filters) => {
    const newQuery = {
      skip: 0,
      filters,
    };
    setQuery(newQuery);
    getProductList(newQuery);
  };

  const handleClearSearhProduct = () => {
    setQuery(initialQuery);
    getProductList(initialQuery);
  };

  const handleAddToCart = (item) => {
    const data = {
      _productId: item._id,
      quantity: 1,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  useEffect(() => {
    getProductList(query);
  }, []);

  const renderFilters = () => {
    return (
      <ProductFilters
        onSearch={handleSearchProduct}
        onClear={handleClearSearhProduct}
        initialFilters={initialQuery.filters}
      />
    );
  };

  const renderSlider = () => {
    return (
      <Carousel autoplay>
        <div>
          <img src={banner1} style={contentStyle} />
        </div>
        <div>
          <img src={banner2} style={contentStyle} />
        </div>
        <div>
          <img src={banner3} style={contentStyle} />
        </div>
      </Carousel>
    );
  };

  const renderProductList = () => {
    return (
      <Row gutter={[12, 12]} style={{ padding: 10 }}>
        {productList?.map((item, index) => (
          <Col key={index} xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Card
              hoverable
              cover={<img alt="example" src={item.image} />}
              actions={[
                <EyeOutlined
                  key="view"
                  style={{ color: "orange", fontSize: 18 }}
                  onClick={() => handleShowProductDetails(item)}
                />,
                <ShoppingCartOutlined
                  key="cart"
                  style={{ color: "#b82837", fontSize: 18 }}
                  onClick={() => handleAddToCart(item)}
                />,
              ]}
            >
              <Space direction="vertical">
                <Text strong onClick={() => handleShowProductDetails(item)}>
                  {item?.name}
                </Text>
                <Text type="secondary">{item?._category?.name}</Text>
                <Text type="success">${item?.price}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  return (
    <div>
      {renderSlider()}
      {renderFilters()}
      {renderProductList()}
      <div className="product-load-more">
        {query?.skip <= productList?.length ? (
          <>
            <DownOutlined onClick={handleLoadMore} />
            <p>Load more</p>
          </>
        ) : (
          <p>No more product</p>
        )}
      </div>
      <ProductDetailsModal
        visible={showModal}
        product={selectedProduct}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default Home;
