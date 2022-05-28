const mongoose = require("mongoose");
const orderDetailSchema = require("./Order").OrderDetails.schema;

const cartSchema = mongoose.Schema({
  _customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  cartDetails: [
    {
      type: orderDetailSchema,
    },
  ],
});

const Cart = mongoose.model("carts", cartSchema);
module.exports = { Cart };
