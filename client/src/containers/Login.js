import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useCustomers from "../_actions/customerActions";

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { customerLogin } = useCustomers();
  const onFinish = (value) => {
    dispatch(customerLogin(value)).then((res) => {
      console.log("REs: ", res);
      if (res.payload.status) {
        const token = res.payload.data.token;
        localStorage.setItem("customerToken", token);
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };
  return (
    <div className="page-wrapper">
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={8} xl={6} xxl={6}>
          <h2>Login</h2>
          <Form
            form={form}
            name="register"
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

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Link to="/forgotPassword">Forgot Password</Link>
              <Link to="/register" style={{ float: "right" }}>
                Create new account
              </Link>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
