import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import useCustomers from "../_actions/customerActions";

function ChangePassword() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { customerChangePassword } = useCustomers();
  const onFinish = (values) => {
    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.password,
    };
    dispatch(customerChangePassword(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };
  return (
    <div className="page-wrapper">
      <Row justify="center" style={{ minHeight: "100vh" }}>
        <Col xs={24} sm={16} md={12} lg={8} xl={6} xxl={6}>
          <h2>Change Password</h2>
          <Form
            form={form}
            name="changePassword"
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="oldPassword"
              label="Old Password"
              rules={[
                {
                  required: true,
                  message: "Please input your old password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm New Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default ChangePassword;
