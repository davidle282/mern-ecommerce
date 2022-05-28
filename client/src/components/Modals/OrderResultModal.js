import { Button, Modal, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function OrderResultModal(props) {
  const { visible, onCancel } = props;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Modal
      title="Order Result"
      width={700}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Result
        status="success"
        title="Successfully Purchased Product(s)"
        subTitle="Thank you for your order"
        extra={[
          <Button type="primary" key="console" onClick={handleGoBack}>
            Go to Homepage
          </Button>,
          <Button key="close">Close</Button>,
        ]}
      />
    </Modal>
  );
}

export default OrderResultModal;
