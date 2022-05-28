import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import useCustomers from "../_actions/customerActions";

function ForgotPassord() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { customerForgotPassword } = useCustomers();
  const onFinish = (values) => {
    dispatch(customerForgotPassword(values)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
        form.resetFields();
      } else {
        message.error(res.payload.message);
      }
    });
  };
  return (
    <div className="page-wrapper">
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={8} xl={6} xxl={6}>
          <h2>Forgot Password</h2>
          <Form
            form={form}
            name="forgotPassword"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Reset Password Link
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default ForgotPassord;
