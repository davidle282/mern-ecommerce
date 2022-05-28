const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Category = mongoose.model("categories", categorySchema);
module.exports = { Category };
