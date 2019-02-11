const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const storage = require("multer").diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = require("multer")({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.get("/", (req, res, next) =>
  Product
    .find()
    .then(products => products.length > 0
      ? res.status(200).json({
        count: products.length,
        products: products.map(product => ({
          name: product.name,
          price: product.price,
          image: product.image,
          request: { type: "GET", url: `http://127.0.0.1:3000/products/${product._id}` }
        }))
      })
      : res.status(200).json({ message: "No entries found!" })
    )
    .catch(error => res.status(500).json({ error }))
);

router.get("/:product", (req, res, next) =>
  Product
    .findById(req.params.product)
    .select("-__v")
    .then(product => product
      ? res.status(200).json({
        name: product.name,
        price: product.price,
        id: product._id,
        image: product.image,
        request: { type: "GET", description: "Get all products", url: "http://127.0.0.1:3000/products" }
      })
      : res.status(404).json({ message: "Product not found" })
    )
    .catch(error => res.status(500).json({ error }))
);

router.post("/", checkAuth, upload.single("image"), (req, res, next) => {
  console.log(req.file);
  new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
  }).save()
    .then(product => res.status(201).json({
      message: "Product was created",
      name: product.name,
      price: product.price,
      _id: product._id,
      request: { type: "POST", url: `http://127.0.0.1:3000/products/${product._id}` }
    }))
    .catch(error => res.status(500).json({ error }))
});

router.patch("/:product", checkAuth, (req, res, next) => {
  const _id = req.params.product;
  const updates = {};

  for (let update of Object.keys(req.body)) updates[update] = req.body[update];

  Product.update({ _id }, { $set: updates })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(500).json({ error }));
});

router.delete("/:product", checkAuth, (req, res, next) => {
  Product.remove({ _id: req.params.product })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(500).json({ error }))
});

module.exports = router;