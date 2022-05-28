const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_S_KEY);
const { Order } = require("../models/Order");
const { Cart } = require("../models/Cart");
const { auth } = require("../middlewares/auth");

const populate = {
  path: "orderDetails",
  populate: {
    path: "_product",
    model: "products",
    populate: {
      path: "_category",
      model: "categories",
    },
  },
};

router.post("/checkout", auth, (req, res) => {
  Cart.findOne({ _customerId: req.customerId }).exec(async (error, data) => {
    if (error) return res.status(400).json({ status: false, error });
    const token = req.body.token;
    const totalAmount = req.body.total;
    const charge = await stripe.charges.create({
      amount: totalAmount * 100,
      currency: "usd",
      description: "Payment for product",
      source: token.id,
    });

    const orderData = {
      _customerId: data._customerId,
      orderDetails: data.cartDetails,
      paymentId: charge.id,
      orderDate: new Date(),
      totalAmount,
    };

    const newOrder = Order(orderData);
    newOrder.save(async (error, data) => {
      if (error) return res.status(400).json({ status: false, error });
      else {
        await Cart.deleteOne({ _customerId: req.customerId });
        return res.status(200).json({
          status: true,
          message: "Order has been created successfully!",
          data,
        });
      }
    });
  });
});

router.get("/orderHistory", auth, (req, res) => {
  Order.find({ _customerId: req.customerId })
    .sort({ orderDate: "desc" })
    .populate(populate)
    .exec((error, data) => {
      if (error) return res.status(400).json({ status: false, error });
      return res.status(200).json({
        status: true,
        message: "Get customer order history successfully!",
        data,
      });
    });
});

module.exports = router;
