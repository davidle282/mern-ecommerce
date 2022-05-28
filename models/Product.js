const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  _category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("products", productSchema);
module.exports = { Product };
