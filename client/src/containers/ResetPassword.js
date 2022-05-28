import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import useCustomers from "../_actions/customerActions";

function ResetPassword() {
  const dispatch = useDispatch();
  const { customerResetPassword } = useCustomers();
  const params = useParams();
  const [form] = Form.useForm();
  const onFinish = (values) => {
    dispatch(customerResetPassword(params.token, values)).then((res) => {
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
        <h2>Reset Password</h2>
        <Form
          form={form}
          name="resetPassword"
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="newPassword"
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
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
    </div>
  );
}

export default ResetPassword;
