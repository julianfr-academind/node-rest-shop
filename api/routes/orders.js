const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/orders");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order
    .find()
    .select("-__v")
    .then(orders => res.status(200).json({
      count: orders.length,
      orders: orders.map(order => {
        return {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: `http://127.0.0.1:3000/orders/${order._id}`
          }
        }
      }),
    }))
    .catch(error => res.status(500).json({ error }));
});

router.get("/:order", (req, res, next) => {
  Order
    .findById(req.params.order)
    .select("-__v")
    .then(order => {
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: `http://127.0.0.1:3000/orders`,
          }
        })
      } else {
        return res.status(404).message({ message: "Order not found" })
      }
    });
});

router.post("/", (req, res, next) => {
  Product
    .findById(req.body.product)
    .then(product => {
      if (product) {
        return new Order({
          _id: new mongoose.Types.ObjectId(),
          product: product._id,
          quantity: req.body.quantity,
        }).save();
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    })
    .then(order => res.status(201).json({
      message: "Order was created",
      request: {
        type: "GET",
        order: {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
        },
        url: `http://127.0.0.1:3000/orders/${order._id}`,
      }
    }))
    .catch(error => res.status(500).json({ error }));
});

router.patch("/:order", (req, res, next) => {
  res.status(200).json({
    message: "Updated order!",
  });
});

router.delete("/:order", (req, res, next) => {
  Order
    .remove({ _id: req.params.order })
    .then(order => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http:127.0.0.1:3000/orders",
        }
      })
    })
    .catch(error => res.status(500).json({ error }))
  res.status(200).json({
    message: "Deleted order!"
  });
});

module.exports = router;