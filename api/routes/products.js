const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");


router.get("/", (req, res, next) => {
  Product
    .find()
    .then(products => {
      if (products.length > 0) res.status(200).json(products)
      else res.status(200).json({ message: "No entries found!" })
    })
    .catch(error => res.status(500).json({ error }))
});

router.get("/:product", (req, res, next) => {
  Product.findById(req.params.product)
    .then(product => {
      if (product) res.status(200).json(product)
      else res.status(404).json({ message: "Product not found" })
    })
    .catch(error => res.status(500).json({ error }));
});

router.post("/", (req, res, next) => {
  new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  }).save()
    .then(product => res.status(201).json({ message: "Product was created", product }))
    .catch(error => res.status(500).json({ error }));

});

router.patch("/:product", (req, res, next) => {
  const _id = req.params.product;
  const updates = {};

  for (let update of Object.keys(req.body)) updates[update] = req.body[update];

  Product.update({ _id }, { $set: updates })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(500).json({ error }));
});

router.delete("/:product", (req, res, next) => {
  Product.remove({ _id: req.params.product })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(500).json({ error }))
});

module.exports = router;