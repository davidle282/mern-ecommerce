const router = require("express").Router();
const { Product } = require("../models/Product");

router.post("/", (req, res) => {
  const skip = parseInt(req.body.skip);
  console.log('~~~skip: ', skip);
  const filters = req.body.filters
  Product.find(filters)
    .populate("_category")
    .skip(skip)
    .limit(8)
    .exec()
    .then((data, error) => {
      if (error) return res.status(400).json({ status: false, error });
      return res.status(200).json({
        status: true,
        message: "Get Product successfully",
        data,
      });
    });
});

router.post("/create", (req, res) => {
  const product = new Product(req.body);
  product.save((error, data) => {
    if (error) return res.status(400).json({ status: false, error });
    return res.status(200).json({
      status: true,
      message: "Product has been added successfully",
      data,
    });
  });
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { Cart } = require("../models/Cart");
// const { Product } = require("../models/Product");
// const { auth } = require("../middlewares/auth");

// const populate = {
//   path: "cartDetails",
//   populate: {
//     path: "_product",
//     model: "products",
//     populate: {
//       path: "_category",
//       model: "categories",
//     },
//   },
// };

// router.post("/addToCart", auth, async (req, res) => {
//   // find if customer cart already exists
//   const customerCart = await Cart.findOne({ _customerId: req.customerId });
//   const product = await Product.findById(req.body._productId);

//   const cartDetails = {
//     _product: req.body._productId,
//     quantity: req.body.quantity,
//     price: product.price,
//     amount: product.price * req.body.quantity,
//   };

//   // if customer cart already exists,
//   if (customerCart) {
//     // find and update quantity if item exist already in cart
//     Cart.findOneAndUpdate(
//       {
//         _customerId: req.customerId,
//         "cartDetails._product": req.body._productId,
//       },
//       {
//         $inc: {
//           "cartDetails.$.quantity": req.body.quantity,
//           "cartDetails.$.amount": product.price * req.body.quantity,
//         },
//       },
//       { new: true }
//     )
//       .populate(populate)
//       .exec()
//       .then((data, error) => {
//         if (error) return res.json({ status: false, error });
//         if (data) {
//           return res
//             .status(200)
//             .json({ status: true, message: "Add Item to cart successfully!", data });
//         } else {
//           //if item doesn't exist in cart, push item to cart
//           Cart.findOneAndUpdate(
//             {
//               _customerId: req.customerId,
//             },
//             {
//               $push: {
//                 cartDetails: {
//                   ...cartDetails,
//                 },
//               },
//             },
//             { new: true }
//           )
//             .populate(populate)
//             .exec()
//             .then((data, error) => {
//               if (error) return res.json({ status: false, error });
//               return res
//                 .status(200)
//                 .json({
//                   status: true,
//                   message: "Add item to cart successfully!",
//                   data,
//                 });
//             });
//         }
//       });
//   } else {
//     // if customer cart does not exist, add new customer cart
//     const newCart = new Cart({
//       _customerId: req.customerId,
//       cartDetails,
//     });
//     newCart.save((error, data) => {
//       if (error) return res.json({ status: false, error });
//       return res
//         .status(200)
//         .json({
//           status: true,
//           message: "Add item to cart successfully!",
//           data,
//         });
//     });
//   }
// });

// router.get("/", auth, (req, res) => {
//   Cart.findOne({ _customerId: req.customerId })
//     .populate(populate)
//     .exec((error, data) => {
//       if (error) return res.json({ status: false, error });
//       return res
//         .status(200)
//         .json({
//           status: true,
//           message: "Get customer cart successfully!",
//           data,
//         });
//     });
// });

// module.exports = router;
